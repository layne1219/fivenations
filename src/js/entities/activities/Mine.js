import Move from './Move';
import PlayerManager from '../../players/PlayerManager';
import EventEmitter from '../../sync/EventEmitter';
import Util from '../../common/Util';
import { TILE_WIDTH, TILE_HEIGHT } from '../../common/Const';

const ns = window.fivenations;

class Mine extends Move {
  /**
   * Generates an Attack activity instance
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super();

    this.motionManager = entity.getMotionManager();

    // the minimum range
    this._minRange = 30;

    // gracefully cleans up the activity when the target is removed
    this.onTargetEntityRemove = () => this.kill();
  }

  /**
   * Applies the activity on an entity
   */
  activate() {
    if (!this.target || !this.target.isResource()) this.kill();
    super.activate();
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

    this.setCoordsToTarget();
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
}

export default Mine;
