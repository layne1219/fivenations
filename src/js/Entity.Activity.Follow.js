define('Entity.Activity.Follow', ['Entity.Activity'], function(Activity) {

    // private vars
    var
    /**
     * saving the last coordinates of the target entity so that we can omit 
     * invoking the moveTo in the update function when not necessary
     * @return {[void]}
     */
        saveTargetLastCoords = function() {
            this.targetLastCoords.x = this.target.getSprite().x;
            this.targetLastCoords.y = this.target.getSprite().y;
        };

    /**
     * Constructor function to FollowActivity
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function FollowActivity(entity) {
        Activity.call(this);
        this.entity = entity;
        this.targetLastCoords = {};
    }

    FollowActivity.prototype = new Activity;
    FollowActivity.prototype.constructor = FollowActivity;

    /**
     * Updating the activity on every tick as follows:
     * - If the target entity is set 
     * - If the target entity has moved since the last tick  
     * @return {[void]}
     */
    FollowActivity.prototype.update = function() {
        if (!this.target) {
            return;
        }
        if (this.targetLastCoords.x === this.target.getSprite().x && this.targetLastCoords.y === this.target.getSprite().y) {
            return;
        }
        saveTargetLastCoords.call(this);
        this.entity.moveTo(this.targetLastCoords.x, this.targetLastCoords.y);
    };

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    FollowActivity.prototype.activate = function() {
        Activity.prototype.activate.call(this);
        if (this.entity && this.target) {
            this.entity.moveTo(this.targetLastCoords.x, this.targetLastCoords.y);
        }
    };

    /**
     * Saving the target entity that will be followed 
     * @return {[void]}
     */
    FollowActivity.prototype.setTarget = function(entity) {
        if (!entity) {
            throw 'Invalid entity is passed to be followed!';
        }
        this.target = entity;
        saveTargetLastCoords.call(this);
    };

    return FollowActivity;

});