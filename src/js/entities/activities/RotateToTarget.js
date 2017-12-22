import Activity from './Activity';

/**
 * Constructor function to RotateToTarget
 * @param  {[object]} entity Instance of an Entity class
 * @return {[object]}
 */
function RotateToTarget(entity) {
  Activity.call(this);
  this.entity = entity;
  this.targetEntity = null;
}

RotateToTarget.prototype = new Activity();
RotateToTarget.prototype.constructor = RotateToTarget;

/**
 * Applying the activity on an entity
 * @return {[void]}
 */
RotateToTarget.prototype.activate = function () {
  Activity.prototype.activate.call(this);

  if (this.entity) {
    this.entity.getMotionManager().rotateToTarget(this);
  }

  this.kill();
};

/**
 * Saving the target to which the entity will be moved
 * @return {[void]}
 */
RotateToTarget.prototype.setTarget = function (entity) {
  this.targetEntity = entity;
};

/**
 * Returns the coordinates to which the entity moves
 * @return {object} object literal that contains the coordinates
 */
RotateToTarget.prototype.getCoords = function () {
  const sprite = this.targetEntity.getSprite();
  return {
    x: sprite.x,
    y: sprite.y,
  };
};

export default RotateToTarget;
