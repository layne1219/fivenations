define('Entity.Activity.Attack', ['Entity.Activity', 'Util'], function(Activity, Util) {

    /**
     * Constructor function to Attack
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function Attack(entity) {
        Activity.call(this);
        this.entity = entity;

        this.onTargetEntityRemove = function() {
            this.kill();
        }.bind(this);        
    }

    Attack.prototype = new Activity;
    Attack.prototype.constructor = Attack;

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    Attack.prototype.activate = function() {
        Activity.prototype.activate.call(this);
    };

    /**
     * Updating the activity on every tick  
     * @return {[void]}
     */
    Attack.prototype.update = function() {

        var distance;
        var range;

        if (!this.target.isTargetable()) {
            this.kill();
        }

        distance = Util.distanceBetween(this.entity, this.target);
        range = this.entity.getWeaponManager().getMinRange();

        if (distance > range) {
            this.entity.getInRange(this.target);
        }

    };    

    /**
     * Saving the target entity that will be attacked 
     * @return {[void]}
     */
    Attack.prototype.setTarget = function(entity) {
        if (!entity) {
            throw 'Invalid entity is passed to be followed!';
        }

        if (this.target) {
            this.target.off('remove', this.onTargetEntityRemove);
        }

        this.target = entity;
        this.target.on('remove', this.onTargetEntityRemove);
    };

    return Attack;

});