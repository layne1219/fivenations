import Activity from '../Activity';
import Move from './Move';

/**
 * Constructor function to FollowActivity
 * @param  {[object]} entity Instance of an Entity class
 * @return {[object]}
 */
function Follow(entity) {
  Move.call(this, entity);
}

Follow.prototype = new Move();
Follow.prototype.constructor = Follow;

/**
 * Updating the activity on every tick as follows:
 * - If the target entity is set
 * - If the target entity has moved since the last tick
 * @return {[void]}
 */
Follow.prototype.update = function () {
  if (!this.target) {
    return;
  }
  if (
    this.coords.x === this.target.getSprite().x &&
    this.coords.y === this.target.getSprite().y
  ) {
    return;
  }
  this.moveTowardsTarget();
};

/**
 * Applying the activity on an entity
 * @return {[void]}
 */
Follow.prototype.activate = function () {
  Activity.prototype.activate.call(this);
  if (this.entity && this.target) {
    this.moveTowardsTarget();
  }
};

/**
 * Move towards the target entity
 * @return {void}
 */
Follow.prototype.moveTowardsTarget = function () {
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
};

/**
 * Saving the target entity that will be followed
 * @return {void}
 */
Follow.prototype.setTarget = function (entity) {
  if (!entity) {
    throw 'Invalid entity is passed to be followed!';
  }
  this.target = entity;
};

export default Follow;
