define('Entity.WeaponManager', ['Entity.Weapon', 'json!weapons'], function(Weapon, weaponsJSON) {

    var cache = {};

    /**
     * Returns a weapon object by the given Id
     * @param  {integer} id 
     * @return {object} object with attributes of the weapon
     */
    function createWeaponById(id){
        for (var i = weaponsJSON.length - 1; i >= 0; i -= 1) {
            if (weaponsJSON[i].id !== id) continue;
            cache[id] = new Weapon(weaponsJSON[i]);
        }
        return cache[id];
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
            this.weapons = [];
            this.dataObject = entity.getDataObject();
        },

        /**
         * Initialises the weapon objects according to the DataObject instance
         * attached to the given entity
         * @return {void}
         */
        initWeapons: function() {

            this.dataObject.getWeapons().forEach(function(id){

                if (!id) return;
                this.weapons.push( createWeaponById(id) );

            }.bind(this));

        },

        /**
         * Returning an array of IDs each of representing a weapon
         * @return {array} A collection of weapons the entity is in a possesion of
         */
        getWeapons: function() {
            return this.weapons;
        }

    };

    return WeaponManager;

});