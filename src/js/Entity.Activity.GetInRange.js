define('Entity.Activity.GetInRange', [
    'Entity.Activity', 
    'Util'
], function(Activity, Util) {

    /**
     * Constructor function to FollowActivity
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function GetInRange(entity) {
        Activity.call(this);
        this.entity = entity;
        this.targetLastCoords = {};
    }

    GetInRange.prototype = new Activity;
    GetInRange.prototype.constructor = GetInRange;

    /**
     * Updating the activity on every tick as follows:
     * - If the target entity is set 
     * - If the target entity has moved since the last tick  
     * @return {[void]}
     */
    GetInRange.prototype.update = function() {
        if (!this.target) {
            return;
        }
        var distance = Util.distanceBetween(this.entity, this.target);
        var range = this.entity.getWeaponManager().getMinRange();
        var targetSprite = this.target.getSprite();

        if (distance > range) { 
            this.entity.moveTo(targetSprite.x, targetSprite.y);
        } else {
            this.kill();
            this.entity.stop();
        }
    };

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    GetInRange.prototype.activate = function() {
        Activity.prototype.activate.call(this);
        if (this.entity && this.target) {
            this.entity.moveTo(this.targetLastCoords.x, this.targetLastCoords.y);
        }
    };

    /**
     * Saving the target entity that will be followed 
     * @return {[void]}
     */
    GetInRange.prototype.setTarget = function(entity) {
        if (!entity) {
            throw 'Invalid entity is passed to be followed!';
        }
        this.target = entity;
    };

    return GetInRange;

});