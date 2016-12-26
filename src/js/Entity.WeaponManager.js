define('Entity.WeaponManager', ['Entity.Weapon', 'json!weapons'], function(Weapon, weaponsJSON) {

    var cache = {};

    /**
     * Returns a weapon object by the given Id
     * @param  {integer} id 
     * @return {object} object with attributes of the weapon
     */
    function createWeaponById(id){
        if (!cache[id]) {
            for (var i = weaponsJSON.length - 1; i >= 0; i -= 1) {
                if (weaponsJSON[i].id !== id) continue;
                cache[id] = weaponsJSON[i];
            }
        }
        return new Weapon(cache[id]);
    }

    /**
     * Constructor function to initialise the WeaponManager
     * @param {[object]} entity [The target entity whose attributes will be tested]
     */
    function WeaponManager(entity) {
        this.init(entity);
        this.initWeapons();
    }

    WeaponManager.prototype = {

        /**
         * Initialising the helper variables of the manager instance 
         * @param  {[object]} entity [Entity instance]
         * @return {[void]}
         */
        init: function(entity) {
            this.entity = entity;
        },

        /**
         * Initialises the weapon objects according to the DataObject instance
         * attached to the given entity
         * @return {void}
         */
        initWeapons: function() {

            this.weapons = [];

            this.entity.getDataObject().getWeapons().forEach(function(id){

                if (!id) return;
                var weapon = createWeaponById(id);
                weapon.setManager(this);
                this.weapons.push(weapon);

            }.bind(this));

        },

        /**
         * Returning an array of IDs each of representing a weapon
         * @return {array} A collection of weapons the entity is in a possesion of
         */
        getWeapons: function() {
            return this.weapons;
        },

        /**
         * Returns the entity possessing this very instance
         * @return {object} an entity instance
         */
        getEntity: function() {
            return this.entity;
        },

        /**
         * Returns an array of weapon instances that are in range of the given entity
         * @param {object} target Entity instance
         * @return {array} list of weapon instances the can fire the target
         */
        getWeaponsCanFireEntity: function(target) {
            if (!target) return [];
            var game = this.entity.getGame();
            var distance = game.physics.arcade.distanceBetween(this.entity, target);
            return this.weapons.filter(function(weapon) {
                return weapon.isReady() && weapon.getRange() >= distance;
            });
        }

    };

    return WeaponManager;

});