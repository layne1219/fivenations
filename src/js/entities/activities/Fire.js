import Activity from './Activity';

/**
 * Constructor function to Fire
 * @param  {[object]} entity Instance of an Entity class
 * @return {[object]}
 */
function Fire(entity) {
  Activity.call(this);
  this.entity = entity;
  this.targetEntity = null;
  this.weapons = [];
}

Fire.prototype = new Activity();
Fire.prototype.constructor = Fire;

/**
 * Applying the activity on an entity
 * @return {[void]}
 */
Fire.prototype.activate = function () {
  Activity.prototype.activate.call(this);

  if (this.targetEntity && this.weapons.length > 0) {
    this.weapons.forEach((weapon) => {
      weapon.fire(this.targetEntity);
    });
  }

  this.kill();
};

/**
 * Saving the target to which the entity will be moved
 * @return {[void]}
 */
Fire.prototype.setTarget = function (entity) {
  this.targetEntity = entity;
};

/**
 * Sets the weapons to be fired at the given target
 * @param {array} weapons List of weapon instances
 */
Fire.prototype.setWeapons = function (weapons) {
  this.weapons = Array.prototype.concat.call(this.weapons, weapons);
};

export default Fire;
