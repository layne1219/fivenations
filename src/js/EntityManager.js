define('EntityManager', [
	'Graphics', 
	'Entity', 
	'DataObject', 
	'Universal.EventBus',
	'Util'
], function(Graphics, Entity, DataObject, EventBus, Util){
	
	var ns = window.fivenations,

		phaserGame,
		singleton,

		// Array for storing all the entities generated 
		entities = [],


		// Entities Event API
		EventAPI = (function(entities){

			/**
			 * creates an immediate object that exposes the event API
			 * for entiteis 
			 * @param  {array} entities [Array of Entity instances]
			 * @return {object} event API calls
			 */
			function eventAPI(entities){

				return {
					/**
					 * Make all the given entities to move to the given coordinates 
					 * @param  {object} options [configuration object to create the desired event]
					 * @return {this}
					 */
					move: function(options){

						var entityNumber = entities.length,
							rnd = entityNumber === 1 ? 0 : (entityNumber * 4),
							data = (function(){
								var data = [];
								for (var i = entityNumber - 1; i >= 0; i -= 1) {
									data.push({
										x: options.x - rnd / 2 + Util.rnd(0, rnd), 
										y: options.y - rnd / 2 + Util.rnd(0, rnd)
									});
								}
								return data;
							})();

						EventBus.getInstance().add({
							id: 'entity/move',
							targets: entities,
							data: data
						});					

						return this;
					},
					/**
					 * Make all the given entities to patrol between the current and given coordinates 
					 * @param  {object} options [configuration object to create the desired event]
					 * @return {void}
					 */				
					patrol: function(options){

						EventBus.getInstance().add({
							id: 'entity/patrol',
							targets: entities,
							data: options
						});					

						return this;
					},
					/**
					 * Make all the given entities to perform a stop action
					 * @param  {object} options [configuration object to create the desired event]
					 * @return {void}
					 */
					stop: function(options){

						EventBus.getInstance().add({
							id: 'entity/stop',
							targets: entities
						});					

						return this;
					},
					/**
					 * Directly returns the private collection of entities 
					 * @return {array} Array of entity instances 
					 */
					raw: function(){
						return entities || [];
					}
				}
			};

			/**
			 * Creates the eventAPI wrapping the given entities
			 * @param  {array} entities [Array of Entity instances]
			 * @return {object} event API calls          
			 */
			function selector(entities){
				if (!entities) throw 'Invalid entities array passed!';
				entities = [].concat.call(entities);
				return eventAPI(entities);
			}

			/**
			 * returns array of entities with the exposing the activity API against them
			 * @param  {mixed} filter [callback to filter entities | Array of Entities | Entity]
			 * @return {array} [Array of entities]
			 */
			function $(filter){
				var targets;
				if (typeof filter === 'function'){
					targets = entities.filter(filter);
				} else if (typeof filter === 'string'){

					if (filter === ':selected'){
						targets = entities.filter(function(entity){
							return entity.isSelected();
						});
					} else {
						targets = entities.filter(function(entity){
							return entity.getId() === filter;
						});
					}

				} else if (typeof filter === 'object'){
					targets = filter;
				} else {
					targets = entities;
				}
				return selector(targets);
			}

			/**
			 * Emits an entity/create event 
			 * @param {[type]} config [description]
			 */
			$.add = function(config){
				EventBus.getInstance().add({
					id: 'entity/create',
					data: config
				});	
			}

			return $;

		})(entities),


	function EntityManager(){
		if (!phaserGame){
			throw 'Invoke setGame first to pass the Phaser Game entity!';
		}
	}

	EntityManager.prototype = {

		/**
		 * Adds an entity object to the private collection
		 * @param {object} entity Entity instance
		 */
		add: function(entity){
			if (!entity){
				return;
			}
			entities.push(entity);
		},

		/**
		 * Removes entity from the private collection
		 * @param {object} entity Entity instance
		 */
		remove: function(entity){
			for (var i = entities.length - 1; i >= 0; i--) {
				if (entity === entities[i]){
					entities.splice(i, 1);
				}
			}
			entity = null;
			delete entity;
		},

		/**
		 * Alters entity attributes 
		 * @param {integer} elapsedTime [elpased time since the last registered tick]
		 * @return {void}
		 */
		update: function(elapsedTime){
			for (var i = entities.length - 1; i >= 0; i--) {
				entities[i].update();
			}
		},
		
		/**
		 * destroys all the existing entities
		 * @return {void}
		 */
		reset: function(){
			entities = [];
		},

		/**
		 * Unselect all entities expect the passed if it is not omitted
		 * It can directly employ the private collection of entities since
		 * it triggers only client related action
		 * @param {object} [entity] [Entity instance that will be excluded from the selection]
		 * @return {void} 
		 */
		unselectAll: function(excludedEntity){
			entities.forEach(function(entity){
				if (excludedEntity !== entity && entity.isSelected()){
					entity.unselect();
				}
			});
		},

		/**
		 * Exposes EventAPI to all the active entities 
		 * @type {object}
		 * @see EventAPI
		 */
		entities: EventAPI,

		/**
		 * returns the subsection of the attributes of the given entities
		 * @param  {[array]} entities [Array of the given entities]
		 * @return {[array]}          [Array of the merged abilities]
		 */
		getMergedAbilities: function(entities){
			var abilities,
				next, i, tmp, tmp2;

			if (!entities || !entities.length){
				return [];
			}

			abilities = entities.shift().getAbilityManager().getAbilities();

			while (next = entities.shift()){
				abilities = abilities.filter(function(val){
					return next.getAbilityManager().getAbilities().indexOf(val) !== -1;
				});
			}

			return abilities;
		},

		/**
		 * returns the Phaser.Game object for inconvinience 
		 * @return {[object]} [Phaser.Game instnace]
		 */
		getGame: function(){
			return phaserGame;
		}

	};

	return {

		/**
		 * sets the global Phaser.Game instance
		 * @param {void}
		 */
		setGame: function(game){
			phaserGame = game;
		},

		/**
		 * returns singleton instance of the manager object
		 * @return {object} Singleton instance of EntityManager
		 */
		getInstance: function(){
			if (!phaserGame){
				throw 'Invoke setGame first to pass the Phaser Game entity!';
			}			
			if (!singleton){
				singleton = new EntityManager();
			}
			return singleton;
		}

	};

});