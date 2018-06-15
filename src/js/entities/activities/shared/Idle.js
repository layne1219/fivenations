import Activity from '../Activity';

const ANIMATION_KEY = 'idle';

/**
 * Constructor function to Idle
 * @param  {object} entity Instance of an Entity class
 * @return {object}
 */
function Idle(entity) {
  Activity.call(this);
  this.setEntity(entity);
}

Idle.prototype = new Activity();
Idle.prototype.constructor = Idle;

/**
 * Links the given entity to this Activity.Idle instance
 * @param {object} entity - Entity instance
 */
Idle.prototype.setEntity = function (entity) {
  this.entity = entity;
};

/**
 * Applies the activity against the linked entity
 * @return {void}
 */
Idle.prototype.activate = function () {
  Activity.prototype.activate.call(this);
  if (this.entity.getMotionManager().isMoving()) {
    this.entity.getMotionManager().stop();
  }
  this.entity.animate(ANIMATION_KEY);
  this.entity.levitate();
};

/**
 * Invokes the logic that is registered on the termination of the activity
 * @return {[void]}
 */
Idle.prototype.deactivate = function () {
  Activity.prototype.deactivate.call(this);
  this.entity.stopAnimation();
  this.entity.stopLevitating();
};

/**
 * Invokes the logic that is registered on the termination of the activity
 * @return {[void]}
 */
Idle.prototype.kill = function () {
  Activity.prototype.kill.call(this);
  this.entity.stopAnimation();
};

export default Idle;
