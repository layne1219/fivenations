import Activity from './Activity';
import Move from './Move';
import Util from '../../common/Util';

/**
 * Constructor function to FollowActivity
 * @param  {[object]} entity Instance of an Entity class
 * @return {[object]} 
 */
function GetInRange(entity) {
    Move.call(this, entity);
}

GetInRange.prototype = new Move;
GetInRange.prototype.constructor = GetInRange;

/**
 * Updating the activity on every tick  
 * @return {[void]}
 */
GetInRange.prototype.update = function() {

    var distance;
    var range;

    if (!this.target) {
        return;
    }

    distance = Util.distanceBetween(this.entity, this.target);
    range = this.entity.getWeaponManager().getMinRange();

    if (distance <= range) {
        this.entity.stop();
        this.kill();
        return;
    }

    if (this.coords.x === this.target.getSprite().x && this.coords.y === this.target.getSprite().y) {
        return;
    } else {
        this.moveTowardsTarget();
    }

};

/**
 * Applying the activity on an entity
 * @return {void}
 */
GetInRange.prototype.activate = function() {
    Activity.prototype.activate.call(this);
    this.moveTowardsTarget();
};

/**
 * Move towards the target entity
 * @return {void}
 */
GetInRange.prototype.moveTowardsTarget = function() {
    this.setCoords({
        x: this.target.getSprite().x,
        y: this.target.getSprite().y
    });
    this.entity.getMotionManager().moveTo(this);
};

/**
 * Saving the target entity that will be followed 
 * @return {void}
 */
GetInRange.prototype.setTarget = function(entity) {
    if (!entity) {
        throw 'Invalid entity is passed to be followed!';
    }
    this.target = entity;
};

export default GetInRange;
