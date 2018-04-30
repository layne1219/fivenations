import Activity from '../Activity';
import PlayerManager from '../../../players/PlayerManager';
import EffectManager from '../../../effects/EffectManager';
import EventEmitter from '../../../sync/EventEmitter';
import EntityManager from '../../EntityManager';
import Util from '../../../common/Util';

const ns = window.fivenations;

// legnth of the Mining in Milliseconds
const MINE_LENGTH_IN_MS = 5000;

// states of the Mine Actvity
const INACTIVE = 0;
const GO_TO_RESOURCE = 1;
const MINE_RESOURCE_STARTED = 2;
const MINE_RESOURCE_ANIMATION = 3;
const MINE_RESOURCE_FINISHED = 4;
const RETURN_TO_STATION = 5;
const MINE_CYCLE_COMPLETED = 6;

// animation key
const MINE_ANIMATION_KEY = 'mining';

// Federation mining station
const MINING_STATION_ID = 'miningstation';

class Mine extends Activity {
  /**
   * Generates an Attack activity instance
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super(entity);

    // shorthands to optimise function calls
    this.motionManager = entity.getMotionManager();
    this.effectManager = EffectManager.getInstance();

    // the minimum range
    this._minRange = 50;

    // default state
    this.state = GO_TO_RESOURCE;

    // rainbow table of available states
    this.states = {
      [GO_TO_RESOURCE]: this.goToResource.bind(this),
      [MINE_RESOURCE_STARTED]: this.mineResourceStarted.bind(this),
      [MINE_RESOURCE_ANIMATION]: this.mineResourceAnimation.bind(this),
      [MINE_RESOURCE_FINISHED]: this.mineResourceFininshed.bind(this),
      [RETURN_TO_STATION]: this.returnToStation.bind(this),
      [MINE_CYCLE_COMPLETED]: this.mineCycleCompleted.bind(this),
    };

    // gracefully cleans up the activity when the target is removed
    this.onTargetEntityRemove = this.setClosestTargetResource.bind(this);
    // callback to find another station when the current one is removed
    this.onTargetStationRemove = this.setClosestTargetStation.bind(this);
  }

  /**
   * Applies the activity on an entity
   */
  activate() {
    const isTargetResource = this.target.getDataObject().isResource();
    if (!this.target || !isTargetResource) this.kill();

    super.activate();
  }

  /**
   * Removes the Activity from the activity queue
   */
  kill() {
    if (this.target) {
      this.target.off('remove', this.onTargetEntityRemove);
    }
    if (this.targetStation) {
      this.targetStation.off('remove', this.onTargetStationRemove);
    }
    super.kill();
  }

  /**
   * Makes the entity get in range to its target resource
   */
  goToResource() {
    if (!this.isResourceInMinRange()) {
      this.entity.moveToEntity(this.target);
    }

    // If the entity is in the mininmum range but it's still moving
    // for any reason
    if (this.motionManager.isMoving()) {
      this.entity.stop();
    }

    // make a transition to the next state
    this.setState(MINE_RESOURCE_STARTED);
  }

  /**
   * Makes the entity begin the mining process
   */
  mineResourceStarted() {
    const time = ns.game.game.time.time;
    this.mineResourceCompletedDueAt = time + MINE_LENGTH_IN_MS;
    this.entity.animate(MINE_ANIMATION_KEY);
    this.setState(MINE_RESOURCE_ANIMATION);
  }

  /**
   * Makes the entity trigger the mining animation and calculates
   * when exactly the mining stage should be fininshed off
   */
  mineResourceAnimation() {
    const time = ns.game.game.time.time;
    if (time >= this.mineResourceCompletedDueAt) {
      this.pickUpCargo();
      this.setState(MINE_RESOURCE_FINISHED);
    } else {
      this.emitMiningEffects();
    }
  }

  /**
   * Stops the mining animation and fetches the closest station
   * to which the resource can be delivered
   */
  mineResourceFininshed() {
    this.entity.stopAnimation();
    // determines the closest station - this is process heavy function
    // so must be executed prudently
    this.setClosestTargetStation();

    // we kill the activity if there is no mining station
    if (this.targetStation) {
      this.setState(RETURN_TO_STATION);
    } else {
      this.kill();
    }
  }

  /**
   * Checks if the entity has arrived at the station
   */
  returnToStation() {
    if (!this.targetStation) {
      this.kill();
      return;
    }

    if (this.isStationFullUp()) {
      this.setClosestTargetStation();
    }

    if (!this.isStationInMinRange()) {
      this.entity.moveToEntity(this.targetStation);
      return;
    }

    if (this.motionManager.isMoving()) {
      this.entity.stop();
    }

    this.setState(MINE_CYCLE_COMPLETED);
  }

  /**
   * State for cleanups and potential syncronisations
   */
  mineCycleCompleted() {
    this.dropOffCargoAtStation();
    this.setState(GO_TO_RESOURCE);
  }

  /**
   * Finds the next clostest resource the Mine Activity can be
   * executed against
   */
  findClosestResource(previous) {
    return previous
      .getClosestAllyEntitiesInRange()
      .filter(entity => entity.getDataObject().isResource() && !entity.isHibernated())
      .shift();
  }

  /**
   * Fetches the closets allies and filters it down to the
   * closest Mining station
   */
  findClosestTargetStation() {
    const entityManager = EntityManager.getInstance();
    const sprite = this.entity.getSprite();
    return entityManager
      .entities(':not(hibernated)')
      .filter((entity) => {
        const dataObject = entity.getDataObject();
        return (
          dataObject.getId() === MINING_STATION_ID && !dataObject.isCargoFull()
        );
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
    const resourceDO = this.target.getDataObject();
    const cargo = resourceDO.getCargo();
    let capacity = this.entity.getDataObject().getCargoCapacity();
    let titanium;
    let silicium;
    let uranium;

    if (cargo.titanium > 0) {
      capacity = Math.min(cargo.titanium, capacity);
      cargo.titanium = -capacity;
      titanium = capacity;
    } else if (cargo.silicium > 0) {
      capacity = Math.min(cargo.silicium, capacity);
      cargo.silicium = -capacity;
      silicium = capacity;
    } else if (cargo.uranium > 0) {
      capacity = Math.min(cargo.uranium, capacity);
      cargo.uranium = -capacity;
      uranium = capacity;
    }

    // updates the altered cargo attributes for the resource
    emitter.synced.entities(this.target).alterCargo({
      damage: capacity, // asteroids lose their hull while they are mined
      ...cargo,
    });

    // picks up the cargo
    emitter.synced.entities(this.entity).alterCargo({
      titanium,
      silicium,
      uranium,
      overwrite: true,
    });
  }

  /**
   * Adds the carried cargo to the station's cargo attributes
   */
  dropOffCargoAtStation() {
    const manager = PlayerManager.getInstance();

    // !!! executed for only authorised users
    if (!manager.isUserAuthorised) return;

    const emitter = EventEmitter.getInstance();
    const entityDO = this.entity.getDataObject();
    const stationDO = this.targetStation.getDataObject();
    const dropOffCargo = entityDO.getCargo();
    const dropOffCargoSum = entityDO.getCargoSum();
    const currentCargo = stationDO.getCargo();
    const currentCargoSum = stationDO.getCargoSum();
    const stationCapacity = stationDO.getCargoCapacity();
    let diff = currentCargoSum + dropOffCargoSum - stationCapacity;

    if (diff > 0) {
      const diffTitanium = dropOffCargo.titanium - diff;
      dropOffCargo.titanium = Math.max(0, diffTitanium);
      diff -= dropOffCargo.titanium;

      const diffSilicium = dropOffCargo.silicium - diff;
      dropOffCargo.silicium = Math.max(0, diffSilicium);
      diff -= dropOffCargo.silicium;

      const diffUranium = dropOffCargo.uranium - diff;
      dropOffCargo.uranium = Math.max(0, diffUranium);
      diff -= dropOffCargo.uranium;
    }

    emitter.synced.entities(this.targetStation).alterCargo(dropOffCargo);
    emitter.synced.entities(this.entity).alterCargo({
      titanium: 0,
      silicium: 0,
      uranium: 0,
      overwrite: true,
    });
  }

  /**
   * Generates effects to perk up the mining animation
   */
  emitMiningEffects() {
    // emitting effects just locally since this is not required
    // to be syncronised as it does not have impact on the game
    if (Math.random() < 0.05) {
      this.effectManager.add({
        id: 'muzzleflash-electric',
        x: this.entity.getSprite().x + Util.rnd(0, 10) - 5,
        y: this.entity.getSprite().y + Util.rnd(0, 10) - 5,
      });
    }

    if (Math.random() < 0.05) {
      this.effectManager.add({
        id: 'construction',
        x: this.target.getSprite().x + Util.rnd(0, 50) - 25,
        y: this.target.getSprite().y + Util.rnd(0, 50) - 25,
      });
    }
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
  setTargetStation(entity) {
    if (this.targetStation) {
      this.targetStation.off('remove', this.onTargetStationRemove);
    }

    this.targetStation = entity;
    this.targetStation.on('remove', this.onTargetStationRemove);
  }

  /**
   * Finds a closest resource and persists it into the target
   * local variable
   */
  setClosestTargetResource(previous) {
    const entity = this.findClosestResource(previous);
    if (entity) {
      this.setTarget(entity);
      this.setState(GO_TO_RESOURCE);
    } else {
      this.kill();
    }
  }

  /**
   * Finds the closest station and persists it into the targetStation
   * local variable
   */
  setClosestTargetStation() {
    const entity = this.findClosestTargetStation();
    if (entity) {
      this.setTargetStation(entity);
    } else {
      this.kill();
    }
  }

  /**
   * Checks whether the target resource entity is in range
   * @return {boolean}
   */
  isResourceInMinRange() {
    const distance = Util.distanceBetween(this.entity, this.target);
    return distance <= this._minRange;
  }

  /**
   * Checks whether the target station entity is in range
   * @return {boolean}
   */
  isStationInMinRange() {
    const distance = Util.distanceBetween(this.entity, this.targetStation);
    return distance <= this._minRange;
  }

  /**
   * Returns whether the target station is full up with resources
   * @return {boolean}
   */
  isStationFullUp() {
    const dataObject = this.targetStation.getDataObject();
    return dataObject.isCargoFull();
  }
}

export default Mine;
