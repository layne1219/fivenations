define('Entity.Activity.Move', ['Entity.Activity'], function(Activity) {

    /**
     * Constructor function to Move
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function Move(entity) {
        Activity.call(this);
        this.entity = entity;
        this.coords = {};
    }

    Move.prototype = new Activity;
    Move.prototype.constructor = Move;

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    Move.prototype.activate = function() {
        Activity.prototype.activate.call(this);
        if (this.entity) {
            this.entity.getMotionManager().moveTo(this.coords.x, this.coords.y);
        }
        this.kill();
    };

    /**
     * Saving the target to which the entity will be moved
     * @return {[void]}
     */
    Move.prototype.setCoords = function(coords) {
        if (!coords) {
            throw 'The given paramater is invalid to set up the coordinates!';
        }
        this.coords = coords;
    };

    return Move;

});