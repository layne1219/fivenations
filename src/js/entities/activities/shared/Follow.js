import Activity from '../Activity';
import Move from './Move';
import Util from '../../../common/Util';

const RECALCULATE_DISTANCE = 100;

class Follow extends Move {
  /**
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super(entity);
    this.killable = false;
  }
  /**
   * Updating the activity on every tick as follows:
   * - If the target entity is set
   * - If the target entity has moved farther then the predefined
   * distance since the last tick
   */
  update() {
    if (!this.target) return;
    this.calculateDistance();
    if (this._distance < RECALCULATE_DISTANCE) return;
    this.moveTowardsTarget();
  }

  /**
   * Calculates the distance between the given and target entity
   */
  calculateDistance() {
    this._distance = Util.distanceBetweenEntityAndCoords(
      this.target,
      this.coords,
    );
  }

  /**
   * Applying the activity on an entity
   * @return {[void]}
   */
  activate() {
    super.activate();
    if (this.entity && this.target) {
      this.moveTowardsTarget();
    }
  }

  /**
   * Move towards the target entity
   * @return {void}
   */
  moveTowardsTarget() {
    this.setCoords({
      x: this.target.getSprite().x,
      y: this.target.getSprite().y,
    });
    if (this.target.getDataObject().isBuilding()) {
      this.entity.moveToEntity(this.target);
      this.kill();
    } else {
      this.entity.getMotionManager().moveTo(this);
    }
  }

  /**
   * Saves the target entity that will be followed
   */
  setTarget(entity) {
    this.target = entity;
  }
}

export default Follow;
