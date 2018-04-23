import Activity from './Activity';
import EventEmitter from '../../sync/EventEmitter';
import Util from '../../common/Util';

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

class Mine extends Activity {
  /**
   * Generates an Attack activity instance
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super(entity);

    // shorthand to optimise function calls
    this.motionManager = entity.getMotionManager();

    // the minimum range
    this._minRange = 50;

    // default state
    this.state = INACTIVE;

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
    this.onTargetEntityRemove = () => this.kill();
  }

  /**
   * Applies the activity on an entity
   */
  activate() {
    const isTargetResource = this.target.getDataObject().isResource();
    if (!this.target || !isTargetResource) this.kill();

    this.state = GO_TO_RESOURCE;
    super.activate();
  }

  /**
   * Makes the entity get in range to its target resource
   */
  goToResource() {
    if (!this.isResourceInMinRange()) {
      this.entity.getInRange(this.target);
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
    this.setState(MINE_RESOURCE_ANIMATION);
  }

  /**
   * Makes the entity trigger the mining animation and calculates
   * when exactly the mining stage should be fininshed off
   */
  mineResourceAnimation() {
    const time = ns.game.game.time.time;
    if (time >= this.mineResourceCompletedDueAt) {
      this.setState(MINE_RESOURCE_FINISHED);
    }
    console.log('Mining Resource Animation...');
  }

  /**
   * Stops the mining animation and fetches the closest station
   * to which the resource can be delivered
   */
  mineResourceFininshed() {
    this.targetStation = this.getClosestStation();
  }

  /**
   * Checks if the entity has arrived at the station
   */
  returnToStation() {
    if (!this.isStationInMinRange()) {
      this.entity.getInRange(this.target);
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
    console.log('emit a synced event of adding resources to the station');
    this.setState(GO_TO_RESOURCE);
  }

  /**
   * Helper function to wrap setting the state into one context
   */

  setState(state) {
    this.state = state;
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
   * Makes the entity to move to the given coordinate without
   * registering another activity. That is helpful to implement
   * entity behaviour that requiest the entity to move during the attack
   * @param {object} coords - { x,  y }
   */
  moveTo(coords) {
    this.coords = coords;
    this.entity.getMotionManager().moveTo(this);
  }

  /**
   * Kills the activity and cleans up the target entity
   */
  kill() {
    this.entity.getWeaponManager().clearTargetEntity();
    super.kill();
  }

  /**
   * Saving the target entity that will be attacked
   * @return {[void]}
   */
  setTarget(entity) {
    if (!entity) {
      throw 'Invalid entity is passed to be mined!';
    }

    if (this.target) {
      this.target.off('remove', this.onTargetEntityRemove);
    }

    this.target = entity;
    this.target.on('remove', this.onTargetEntityRemove);

    this.setCoordsToTarget();
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
   * Updates the coords object with the coordinates of the given
   * target Entity
   */
  setCoordsToTarget() {
    const sprite = this.target.getSprite();
    const x = sprite.x;
    const y = sprite.y;
    this.setCoords({
      x,
      y,
    });
  }

  /**
   * Saving the target to which the entity will be moved
   * @return {[void]}
   */
  setCoords(coords) {
    this.coords = coords;
  }

  /**
   * Returns the coordinates to which the entity moves
   * @return {object} object literal that contains the coordinates
   */
  getCoords() {
    return this.coords;
  }
}

export default Mine;
