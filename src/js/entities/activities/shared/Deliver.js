import Activity from '../Activity';
import PlayerManager from '../../../players/PlayerManager';
import EventEmitter from '../../../sync/EventEmitter';
import EntityManager from '../../EntityManager';
import Util from '../../../common/Util';

const ns = window.fivenations;

// collection of entity ids where cargo can be delivered
const DELIVERY_POINTS = ['commandcenter'];

// states of the Deliver Actvity
const INACTIVE = 0;
const GO_TO_PICKUP_POINT = 1;
const WAIT_FOR_CARGO = 2;
const CARGO_IS_READY_TO_BE_DELIVERED = 3;
const GO_TO_DELIVERY_POINT = 4;
const DELIVERY_FINISHED = 5;

class Deliver extends Activity {
  /**
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super(entity);

    // shorthands to optimise function calls
    this.motionManager = entity.getMotionManager();

    // fetch cargo capacity
    this._capacity = this.entity.getDataObject().getCargoCapacity();

    // default state
    this.state = GO_TO_PICKUP_POINT;

    // rainbow table of available states
    this.states = {
      [GO_TO_PICKUP_POINT]: this.goToPickUpPoint.bind(this),
      [WAIT_FOR_CARGO]: this.waitForCargo.bind(this),
      [CARGO_IS_READY_TO_BE_DELIVERED]: this.cargoIsReadyToBeDelivered.bind(this),
      [GO_TO_DELIVERY_POINT]: this.goToDeliveryPoint.bind(this),
      [DELIVERY_FINISHED]: this.deliveryFinished.bind(this),
    };

    // callback to find another station when the current one is removed
    this.onDeliveryPointRemove = this.setClosestDeliveryPoint.bind(this);
  }

  /**
   * Applies the activity on an entity
   */
  activate() {
    super.activate();

    if (!this._capacity) {
      this.kill();
      return;
    }

    this.pickUpPoint = this.entity.getHomeStation();
    if (!this.pickUpPoint) {
      this.kill();
      return;
    }
    this._pickUpPointRange = this.pickUpPoint.getDataObject().getWidth();

    this.setClosestDeliveryPoint();
  }

  /**
   * Removes the Activity from the activity queue
   */
  kill() {
    if (this.dropOffPoint) {
      this.dropOffPoint.off('remove', this.onDeliveryPointRemove);
    }
    super.kill();
  }

  /**
   * Makes the entity get in range to its target resource
   */
  goToPickUpPoint() {
    if (!this.isPickUpPointInMinRange()) {
      this.entity.moveToEntity(this.pickUpPoint);
    }

    // If the entity is in the mininmum range but it's still moving
    // for any reason
    if (this.motionManager.isMoving()) {
      this.entity.stop();
    }

    // make a transition to the next state
    this.setState(WAIT_FOR_CARGO);
  }

  /**
   * Makes the entity begin the mining process
   */
  waitForCargo() {
    if (this.hasPickUpPointEnoughCargo()) {
      this.pickUpCargo();
      this.setState(CARGO_IS_READY_TO_BE_DELIVERED);
    }
  }

  /**
   * Stops the mining animation and fetches the closest station
   * to which the resource can be delivered
   */
  cargoIsReadyToBeDelivered() {
    // determines the closest station - this is process heavy function
    // so must be executed prudently
    this.setClosestDeliveryPoint();

    // we kill the activity if there is no mining station
    if (this.dropOffPoint) {
      this.setState(GO_TO_DELIVERY_POINT);
    }
  }

  /**
   * Checks if the entity has arrived at the station
   */
  goToDeliveryPoint() {
    if (!this.dropOffPoint) {
      this.kill();
      return;
    }

    if (!this.isDeliveryPointInMinRange()) {
      this.entity.moveToEntity(this.dropOffPoint);
      return;
    }

    if (this.motionManager.isMoving()) {
      this.entity.stop();
    }

    this.setState(DELIVERY_FINISHED);
  }

  /**
   * Alters the players economy based on the delivery
   */
  deliveryFinished() {
    this.dropOffCargo();
    this.setState(GO_TO_PICKUP_POINT);
  }

  /**
   * Drops off the cargo and emits the sync events to alter
   * the actual player's economy accordingly
   */
  dropOffCargo() {
    const manager = PlayerManager.getInstance();

    // !!! executed for only authorised users
    if (!manager.isUserAuthorised) return;

    const emitter = EventEmitter.getInstance();
    const entityDO = this.entity.getDataObject();
    const cargo = entityDO.getCargo();
    const player = this.dropOffPoint.getPlayer();
    const playerTitanium = player.getTitanium();
    const playerSilicium = player.getSilicium();
    const playerUranium = player.getUranium();

    emitter.synced.entities(this.entity).alterCargo({
      titanium: 0,
      silicium: 0,
      uranium: 0,
    });

    emitter.synced.players(player).alter({
      titanium: playerTitanium + cargo.titanium,
      silicium: playerSilicium + cargo.siliciym,
      uranium: playerUranium + cargo.uranium,
    });
  }

  /**
   * Returns true if the pick up pont has equal or more cargo
   * than this entity can carry.
   * @return {boolean}
   */
  hasPickUpPointEnoughCargo() {
    const cargo = this.pickUpPoint.getDataObject().getCargo();
    const sumCargo = ['titanium', 'silicium', 'uranium'].reduce(
      (sum, key) => (sum += cargo[key]),
      0,
    );

    return sumCargo >= this._capacity;
  }

  /**
   * Fetches the closets allies and filters it down to the
   * closest entity that can recieve the cargo
   */
  findClosestDeliveryPoint() {
    const entityManager = EntityManager.getInstance();
    const sprite = this.entity.getSprite();
    return entityManager
      .entities(':not(hibernated)')
      .filter((entity) => {
        const dataObject = entity.getDataObject();
        return DELIVERY_POINTS.some(id => id === dataObject.getId());
      })
      .sort((a, b) => {
        const distanceToA = Util.distanceBetweenSprites(sprite, a.getSprite());
        const distanceToB = Util.distanceBetweenSprites(sprite, b.getSprite());
        return distanceToA - distanceToB;
      })
      .shift();
  }

  /**
   * Alters the carried cargo based on the target resource
   */
  pickUpCargo() {
    const manager = PlayerManager.getInstance();

    // !!! executed for only authorised users
    if (!manager.isUserAuthorised()) return;

    const emitter = EventEmitter.getInstance();
    const pickUpPointDO = this.pickUpPoint.getDataObject();
    const cargo = pickUpPointDO.getCargo();
    const capacity = this.entity.getDataObject().getCargoCapacity();
    const delivery = {};
    let deliveryCapacity = capacity;

    ['titanium', 'silicium', 'uranium'].forEach((key) => {
      if (cargo[key] > 0 && deliveryCapacity > 0) {
        const pickUp = Math.min(cargo[key], deliveryCapacity);
        cargo[key] -= pickUp;
        delivery[key] = pickUp;
        deliveryCapacity -= pickUp;
      }
    });

    // updates the altered cargo attributes of the pick up point
    emitter.synced.entities(this.pickUpPoint).alterCargo(cargo);

    // picks up the cargo
    emitter.synced.entities(this.entity).alterCargo(delivery);
  }

  /**
   * Updates the activity on every tick
   */
  update() {
    // invokes the functionality that is bound to the current state,
    // this is executed at every tick
    this.states[this.state]();
  }

  /**
   * Helper function to wrap setting the state into one context
   */
  setState(state) {
    this.state = state;
  }

  /**
   * Saves the target entity that will be attacked
   * @return {[void]}
   */
  setTarget(entity) {
    if (this.target) {
      this.target.off('remove', this.onTargetEntityRemove);
    }

    this.target = entity;
    this.target.on('remove', this.onTargetEntityRemove);
  }

  /**
   * Saving the target entity that will be attacked
   * @return {[void]}
   */
  setDeliveryPoint(entity) {
    if (this.dropOffPoint) {
      this.dropOffPoint.off('remove', this.onDeliveryPointRemove);
    }

    this.dropOffPoint = entity;
    this._dropOffPointRange = this.dropOffPoint.getDataObject().getWidth();
    this.dropOffPoint.on('remove', this.onDeliveryPointRemove);
  }

  /**
   * Finds the closest station and persists it into the targetStation
   * local variable
   */
  setClosestDeliveryPoint() {
    const entity = this.findClosestDeliveryPoint();
    if (entity) {
      this.setDeliveryPoint(entity);
    } else {
      this.kill();
    }
  }

  /**
   * Checks whether the target resource entity is in range
   * @return {boolean}
   */
  isPickUpPointInMinRange() {
    const distance = Util.distanceBetween(this.entity, this.pickUpPoint);
    return distance <= this._pickUpPointRange;
  }

  /**
   * Checks whether the target station entity is in range
   * @return {boolean}
   */
  isDeliveryPointInMinRange() {
    const distance = Util.distanceBetween(this.entity, this.dropOffPoint);
    return distance <= this._dropOffPointRange;
  }
}

export default Deliver;
