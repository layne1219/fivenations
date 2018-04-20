import Activity from './Activity';
import PlayerManager from '../../players/PlayerManager';
import EventEmitter from '../../sync/EventEmitter';
import Util from '../../common/Util';
import { TILE_WIDTH, TILE_HEIGHT } from '../../common/Const';

const ns = window.fivenations;

class Mine extends Activity {
  /**
   * Generates an Attack activity instance
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super();

    this.entity = entity;
    this.motionManager = entity.getMotionManager();

    // helper variable to avoid calculating the distance between
    // the main and target entity more than once per tick
    this._distance = 0;

    // the minimum range
    this._minRange = 30;

    // gracefully cleans up the activity when the target is removed
    this.onTargetEntityRemove = () => this.kill();
  }

  /**
   * Applies the activity on an entity
   */
  activate() {
    super.activate();
    this.calculateDistance();
  }

  /**
   * Calculates the distance between the given and target entity
   */
  calculateDistance() {
    this._distance = Util.distanceBetween(this.entity, this.target);
  }

  /**
   * Updates the activity on every tick
   */
  update() {
    // calculates the distance betwen the given and target entity
    // and saves it into a local helper variable for optimisation
    this.calculateDistance();

    // unshifts GetInRange Activiy to the Activity queue if the entity
    // hasn't arrived at the distance where its weapon with the smallest range
    // can be fired
    if (!this.isTargetInMinRange()) {
      this.entity.getInRange(this.target, false);
      return;
    }

    if (this.motionManager.isMoving()) {
      this.entity.stop();
      return;
    }

    if (!this.isEntityFacingTarget()) {
      this.entity.rotateToTarget(this.target);
    }
  }

  /**
   * Makes the entity to move to the given coordinate without
   * registering another activity. That is helpful to implement
   * entity behaviour that requiest the entity to move during the attack
   */
  moveTo(coords) {
    this.coords = coords;
    this.entity.getMotionManager().moveTo(this);
  }

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
      throw 'Invalid entity is passed to be followed!';
    }

    if (this.target) {
      this.target.off('remove', this.onTargetEntityRemove);
    }

    this.target = entity;
    this.target.on('remove', this.onTargetEntityRemove);
  }

  /**
   * Checks whether the specified target entity is in range
   * @return {boolean}
   */
  isTargetInMinRange() {
    return this._distance <= this._minRange;
  }

  /**
   * Checks whether the specified target entity is facing
   * the given target entity
   * @return {boolean}
   */
  isEntityFacingTarget() {
    return this.motionManager.isEntityFacingTargetEntity(this.target);
  }

  /**
   * Returns the coordinates to which the entity is heading. It is only
   * used if the entity executes the DogFight logic while attacking
   * @return {object} {x, y}
   */
  getCoords() {
    return this._dogFightCoords;
  }

  /**
   * Returns the tile of the destination
   * @return {object} { x, y }
   */
  getTile() {
    return {
      x: Math.floor(this._dogFightCoords.x / TILE_WIDTH),
      y: Math.floor(this._dogFightCoords.y / TILE_HEIGHT),
    };
  }
}

export default Attack;
