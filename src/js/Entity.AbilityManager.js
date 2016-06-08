define('Entity.AbilityManager', ['json!abilities'], function(abilitiesJSON) {

    /**
     * Constructor function to initialise the AbilityManager
     * @param {[object]} entity [The target entity whose attributes will be tested]
     */
    function AbilityManager(entity) {
        this.init(entity);
        this.testAbilities();
    }

    AbilityManager.prototype = {

        /**
         * Initialising the helper variables of the manager instance 
         * @param  {[object]} entity [Entity instance]
         * @return {[void]}
         */
        init: function(entity) {

            this.abilities = [];

            this.entity = entity;
            this.dataObject = entity.getDataObject();
        },

        /**
         * Determining which abilities the entity possess according to its datas
         * @return {[void]}
         */
        testAbilities: function() {

            if (this.canMove()) {
                this.abilities = this.abilities.concat([
                    abilitiesJSON.move,
                    abilitiesJSON.stop,
                    abilitiesJSON.patrol,
                    abilitiesJSON.hold,
                    abilitiesJSON.defend
                ]);
            }

        },

        /**
         * Returning true if the entity can alter its positions
         * @return {[booelan]} true if the entity can alter its positions
         */
        canMove: function() {
            return this.dataObject.getSpeed() > 0;
        },

        /**
         * Returning an array of IDs each of representing an ability 
         * the entity is capable of
         * @return {[Array]} A collection of abilities the entity is in a possesion of
         */
        getAbilities: function() {
            return this.abilities;
        }

    };

    return AbilityManager;

});