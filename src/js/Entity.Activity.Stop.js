define('Entity.Activity.Stop', ['Entity.Activity'], function(Activity) {

    /**
     * Constructor function to Stop
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function Stop(entity) {
        Activity.call(this);
        this.entity = entity;
    }

    Stop.prototype = new Activity;
    Stop.prototype.constructor = Stop;

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    Stop.prototype.activate = function() {
        Activity.prototype.activate.call(this);
        if (this.entity) {
            this.entity.getMotionManager().stop();
        }
        this.kill();
    };

    return Stop;

});