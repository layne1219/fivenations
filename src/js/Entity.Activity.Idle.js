define('Entity.Activity.Idle', ['Entity.Activity'], function(Activity) {

    var KEY_IDLE = 'idle';

    /**
     * Constructor function to Idle
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function Idle(entity) {
        Activity.call(this);
        this.initAnimation(entity);
    }

    Idle.prototype = new Activity;
    Idle.prototype.constructor = Idle;

    /**
     * Fetches and saves the Phaser.Animation object to an instance variable
     * @param  {object} entity [Phaser.Entity instance]
     * @return {void}
     */
    Idle.prototype.initAnimation = function(entity){
        if (!entity) {
            return;
        }
        this.animationManager = entity.getAnimationManager();
    };

    /**
     * Applies the activity against the linked entity
     * @return {[void]}
     */
    Idle.prototype.activate = function() {
        Activity.prototype.activate.call(this);
        if (!this.animationManager.getAnimation(KEY_IDLE)) return;
        this.animationManager.play(KEY_IDLE);
    };

    /**
     * Invokes the logic that is registered on the termination of the activity
     * @return {[void]}
     */
    Idle.prototype.deactivate = function() {
        Activity.prototype.deactivate.call(this);
        if (!this.animationManager.getAnimation(KEY_IDLE)) return;
        this.animationManager.stop(KEY_IDLE);
    };

    /**
     * Invokes the logic that is registered on the termination of the activity
     * @return {[void]}
     */
    Idle.prototype.kill = function() {
        Activity.prototype.kill.call(this);
        if (!this.animationManager.getAnimation(KEY_IDLE)) return;
        this.animationManager.stop(KEY_IDLE);
    };

    return Idle;

});