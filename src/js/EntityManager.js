define('EntityManager', [
	'Graphics', 
	'Entity', 
	'DataObject', 
	'PlayerManager',
	'Universal.EventBus',
	'Util'
], function(Graphics, Entity, DataObject, PlayerManager, EventBus, Util){
	
	var 
		MAX_SELECTABLE_UNITS = 22,

		ns = window.fivenations,

		phaserGame,
		singleton,

		// unique indentifier for maintaning the units in an array
		id = 0,

		// Array for storing all the entities generated 
		entities = [],

		// entity activities
		createTailingObject = function(entities){
			return {
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
				raw: function(){
					return entities;
				}
			}
		},

		// selector object
		selector = function(entities){
			if (!entities || !entities.length) throw 'Invalid entities array passed!';
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
			return id++;
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

		select: function(filter){
			var targets;
			if (typeof filter === 'function'){
				targets = entities.filter(filter);
			} else {
				targets = entities;
			}
			return selector(targets);
		},

		/**
		 * Make all the selected entities to move to the given coordinates 
		 * @param  {integer} x [horizontal offset of the map to which the entities move]
		 * @param  {integer} y [vertical offset of the map to which the entities move]
		 * @return {void}
		 */
		moveAllSelectedTo: function(x, y){
			this.select(function(entity){
				return entity.isSelected() && this.isEntityControlledByUser(entity);
			}.bind(this)).move({x: x, y: y});
		},

		/**
		 * Make all the selected entities to patrol between the current and given coordinates 
		 * @param  {integer} x [horizontal offset of the map between which the entities patrol]
		 * @param  {integer} y [vertical offset of the map between which the entities patrol]
		 * @return {void}
		 */
		patrolAllSelectedTo: function(x, y){
			var entities = this.getAllSelected().filter(function(entity){
            		return this.isEntityControlledByUser(entity);
            	}.bind(this));

			EventBus.getInstance().add({
				id: 'entity/move',
				targets: entities,
				data: (function(){
					var data = [];
					for (var i = entityNumber - 1; i >= 0; i -= 1) {
						data.push({x: x, y: y});
					}
					return data;
				})()
			});
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

		getAllHover: function(){
			return this.get().filter(function(entity){
				return entity.isHover();
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

		isEntityControlledByUser: function(entity) {
			if (!entity || 'function' !== typeof entity.getDataObject){
				throw 'Fitst parameter must be a valid entity object!';
			}
			return entity.getDataObject().getTeam() === PlayerManager.getInstance().getUser().getTeam();
		},

		getMaxSelectableUnitNumber: function(){
			return MAX_SELECTABLE_UNITS;
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

		setGame: function(game){
			phaserGame = game;
		},

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