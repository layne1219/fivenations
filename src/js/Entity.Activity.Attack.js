define('Entity.Activity.Attack', ['Entity.Activity'], function(Activity) {

    /**
     * Constructor function to Attack
     * @param  {[object]} entity Instance of an Entity class
     * @return {[object]} 
     */
    function Attack(entity) {
        Activity.call(this);
        this.entity = entity;
        this.coords = {};
    }

    Attack.prototype = new Activity;
    Attack.prototype.constructor = Attack;

    /**
     * Applying the activity on an entity
     * @return {[void]}
     */
    Attack.prototype.activate = function() {
        if (this.entity) {
            this.entity.getMotionManager().AttackTo(this);
        }
        Activity.prototype.activate.call(this);
    };

    /**
     * Saving the target to which the entity will be Attackd
     * @return {[void]}
     */
    Attack.prototype.setCoords = function(coords) {
        if (!coords) {
            throw 'The given paramater is invalid to set up the coordinates!';
        }
        this.coords = coords;
    };

    /**
     * Returns the coordinates to which the entity Attacks 
     * @return {object} object literal that contains the coordinates
     */
    Attack.prototype.getCoords = function() {
        return this.coords;
    };

    return Attack;

});