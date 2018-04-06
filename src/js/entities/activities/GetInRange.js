/* eslint no-underscore-dangle: 0 */
import Activity from './Activity';
import Move from './Move';
import Util from '../../common/Util';

const rangeTooFarFactor = 1.5;

class GetInRange extends Move {
  /**
   * @param {object} entity Instance of an Entity class
   * @param {boolean} willBeKilledIfTargetTooFar
   */
  constructor(entity, willBeKilledIfTargetTooFar = false) {
    super(entity);
    this.willBeKilledIfTargetTooFar = willBeKilledIfTargetTooFar;

    // helper variable to avoid calculating the distance between
    // the main and target entity more than once per tick
    this._distance = 0;

    // the minimum range
    this._minRange = this.entity.getWeaponManager().getMinRange();

    // the range value that is deemed too far
    this._rangeTooFar =
      this.entity.getWeaponManager().getMaxRange() * rangeTooFarFactor;
  }

  /**
   * Calculates the distance between the given and target entity
   */
  calculateDistance() {
    this._distance = Util.distanceBetween(this.entity, this.target);
  }

  /**
   * Updating the activity on every tick
   * @return {[void]}
   */
  update() {
    if (!this.target) {
      return;
    }

    // calculates the distance betwen the given and target entity
    // and saves it into a local helper variable for optimisation
    this.calculateDistance();

    // provided the entity has already approached the target
    // close enough so that its weapon with the smallest range can be released
    // - or - it has any releasable weapon
    // - or - the target has been out of range and gotten too far
    if (
      this.isInMinRange() ||
      this.isWeaponReadyToFireTarget() ||
      this.isTargetTooFar()
    ) {
      this.entity.stop();
      this.kill();
      return;
    }

    this.moveTowardsTarget();
  }

  /**
   * Applying the activity on an entity
   * @return {void}
   */
  activate() {
    this.setCoordsToTarget();
    super.activate();
  }

  /**
   * Move towards the target entity
   * @return {void}
   */
  moveTowardsTarget() {
    if (
      this.coords.x === this.target.getSprite().x &&
      this.coords.y === this.target.getSprite().y
    ) {
      return;
    }

    this.setCoordsToTarget();
    this.entity.getMotionManager().moveTo(this);
  }

  /**
   * Saving the target entity that will be followed
   * @param {object} entity - Entity
   */
  setTarget(entity) {
    this.target = entity;
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
   * Returns whether the target is in the range of the weapon
   * that is with the smallest range attribute
   * @return {boolean}
   */
  isInMinRange() {
    return this._distance <= this._minRange;
  }

  /**
   * Returns true if the entity currently has any releasable weapon
   * @return {boolean}
   */
  isWeaponReadyToFireTarget() {
    return this.entity.getWeaponManager().isWeaponReadyToFireTarget();
  }

  /**
   * Returns whether the target has gotten too far
   * @return {boolean}
   */
  isTargetTooFar() {
    if (!this.willBeKilledIfTargetTooFar) return false;
    return this._distance > this._rangeTooFar;
  }
}

export default GetInRange;
