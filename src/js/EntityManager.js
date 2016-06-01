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

		// entity activities
		createTailingObject = function(entities){
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
				stop: function(options){

					EventBus.getInstance().add({
						id: 'entity/stop',
						targets: entities
					});					

					return this;
				},
				raw: function(){
					return entities;
				}
			}
		},

		// selector object
		selector = function(entities){
			if (!entities) throw 'Invalid entities array passed!';
			entities = [].concat.call(entities);
			return createTailingObject(entities);
		};


	function EntityManager(){
		if (!phaserGame){
			throw 'Invoke setGame first to pass the Phaser Game entity!';
		}
	}

	EntityManager.prototype = {

		/**
		 * Creating and adding a new entity to the entity pool based on the given configurations
		 * @param {[object]} config [JSON literal that is to describe all the data for the creation process]
		 * @return {[object]} [It returns the newly created Entity object]
		 */
		add: function(config){

			if (!config){
				throw 'Invalid configuration object passed as a parameter!';
			}
			
			if (Object.keys(ns.entities).indexOf(config.id) === -1){
				throw 'The requrested entity is not registered!';
			}

			var entity,

				team = config.team || 1,

				// sprite Ids are consisted of the sprite name and the colour id
				spriteId = [config.id, team].join('-'),

				// instanciating a Phaser.Game.Sprite objet for the entity
				sprite = phaserGame.add.sprite(0, 0, spriteId),

				// fomring the DataObject instance from the preloaded JSON file
				dataObject = new DataObject(phaserGame.cache.getJSON(config.id)),

				// rendering group name
				groupName = dataObject.isBuilding() ? 'entities-buildings' : 'entities',

				// choosing the group for entities so that other elements will be obscured by them
				// it's kind of applying zIndex on entities
				group = Graphics.getInstance().getGroup(groupName);

			// passing the team Id from the config param object
			dataObject.setTeam( team );

			// adding the freshly created entity to the main array
			entities.push( entity = new Entity(this, sprite, dataObject) );

			// setting the coordinates if not ommitted 
			if (config.x || config.y){
				sprite.x = config.x || 0;
				sprite.y = config.y || 0;
			}

			group.add(sprite);

			return entity;
		},

		getNextId: function(){
			return Util.getGUID();
		},

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
		 * destroys all the existing entities
		 * @return {void}
		 */
		reset: function(){
			entities = [];
		},

		/**
		 * Unselect all entities expect the passed if it is not omitted
		 * @param {object} [entity] [Entity instance that will be excluded from the selection]
		 * @return {void} 
		 */
		unselectAll: function(excludedEntity){
			this.get().forEach(function(entity){
				if (excludedEntity !== entity && entity.isSelected()){
					entity.unselect();
				}
			});
		},

		/**
		 * returns array of entities with the exposing the activity API against them
		 * @param  {mixed} filter [callback to filter entities | Array of Entities | Entity]
		 * @return {array} [Array of entities]
		 */
		select: function(filter){
			var targets;
			if (typeof filter === 'function'){
				targets = entities.filter(filter);
			} else if (typeof filter === 'object'){
				targets = filter;
			} else {
				targets = entities;
			}
			return selector(targets);
		},

		getGame: function(){
			return phaserGame;
		},

		get: function(id){
			if (undefined === id){
				return entities;
			}

			for (var i = entities.length - 1; i >= 0; i--) {
				if (id === entities[i].getId()){
					return entities[i];
				} 
			}

			return [];
		},

		getAllSelected: function(){
			return this.get().filter(function(entity){
				return entity.isSelected();
			});
		},

		/**
		 * Return an array of IDs of the given entities
		 * @param  {[array]} entities [Array of the given entities]
		 * @return {[array]}          [Array of integers representing the ID of the entities]
		 */
		getIds: function(entities){
			return entities.map(function(entity){
				return entity.getId();
			});
		},

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