define('Entity.Activity.GetToDock', [
    'Entity.Activity',
    'Entity.Activity.GetInRange', 
    'Util'
], function(GetInRange, Move, Util) {

    /**
     * Constructor function to FollowActivity
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function GetToDock(entity) {
        Move.call(this, entity);
    }

    GetToDock.prototype = new GetInRange;
    GetToDock.prototype.constructor = GetToDock;

    /**
     * Updating the activity on every tick  
     * @return {[void]}
     */
    GetToDock.prototype.update = function() {

        var distance;

        if (!this.target) {
            return;
        }

        distance = Util.distanceBetween(this.entity, this.target);

        if (distance <= this.range) {
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
     * Saving the target entity that will be followed 
     * @return {void}
     */
    GetToDock.prototype.setTarget = function(entity) {
        GetInRange.prototype.setTarget(entity);
        // for optimisation 
        this.range = entity.getDataObject().getWidth();
    }

    return GetInRange;

});