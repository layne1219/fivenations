import Activity from './Activity';
import Move from './Move';
import Util from '../../common/Util';

class GetInRange extends Move {
  /**
   * @param {object} entity Instance of an Entity class
   */
  constructor(entity) {
    super(entity);
  }

  /**
   * Updating the activity on every tick
   * @return {[void]}
   */
  update() {
    if (!this.target) {
      return;
    }

    // provided the entity has already approached the target
    // so that its weapon with the smallest range can be released
    // - or - it has any releasable weapon
    if (this.isInMinRange() || this.isWeaponReadyToFireTarget()) {
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
    super.activate();
    this.moveTowardsTarget();
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

    this.setCoords({
      x: this.target.getSprite().x,
      y: this.target.getSprite().y,
    });
    this.entity.getMotionManager().moveTo(this);
  }

  /**
   * Saving the target entity that will be followed
   * @oaram {object} entity - Entity
   */
  setTarget(entity) {
    this.target = entity;
  }

  /**
   * Returns whether the target is in the range of the weapon
   * that is with the smallest range attribute
   * @return {boolean}
   */
  isInMinRange() {
    const distance = Util.distanceBetween(this.entity, this.target);
    const range = this.entity.getWeaponManager().getMinRange();
    return distance <= range;
  }

  /**
   * Returns true if the entity currently has any releasable weapon
   * @return {boolean}
   */
  isWeaponReadyToFireTarget() {
    return this.entity.getWeaponManager().isWeaponReadyToFireTarget();
  }
}

export default GetInRange;
