define('Entity.AbilityManager', ['json!abilities'], function(abilitiesJSON){

	/**
	 * Constructor function to initialise the AbilityManager
	 * @param {[object]} entity [The target entity whose attributes will be tested]
	 */
	function AbilityManager(entity){
		this.init( entity );
		this.testAbilities();
	}

	AbilityManager.prototype = {

		/**
		 * Initialising the helper variables of the manager instance 
		 * @param  {[object]} entity [Entity instance]
		 * @return {[void]}
		 */
		init: function(entity){

			this.abilities = [];

			this.entity = entity;
			this.dataObject = entity.getDataObject();
		},

		testAbilities: function(){

			if (this.canMove()){
				this.abilities.concat([
					abilitiesJSON.move,
					abilitiesJSON.stop,
					abilitiesJSON.patrol,
					abilitiesJSON.hold,
					abilitiesJSON.defend
				]);	
			}

		},

		canMove: function(){
			return this.dataObject.speed > 0;
		}

	};

	return AbilityManager;

});