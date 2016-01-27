define('EntityManager', ['Entity', 'DataObject', 'PlayerManager'], function(Entity, DataObject, PlayerManager){
	
	var ns = window.fivenations,

		phaserGame,
		singleton,

		// unique indentifier for maintaning the units in an array
		id = 0,

		// Array for storing all the entities generated 
		entities = [],

		// reference to a Phaser.Group
		group,

		// Limit for number of selectable units by one multiselection
		MAX_SELECTABLE_UNITS = 22;


	function EntityManager(){
		if (!phaserGame){
			throw 'Invoke setGame first to pass the Phaser Game entity!';
		}
		group = phaserGame.add.group();
	}

	EntityManager.prototype = {

		add: function(config){

			if (!config){
				throw 'Invalid configuration object passed as a parameter!';
			}
			
			if (Object.keys(ns.entities).indexOf(config.id) === -1){
				throw 'The requrested entity is not registered!';
			}

			var team = config.team || 1,

				// sprite Ids are consisted of the sprite name and the colour id
				spriteId = [config.id, team].join('-'),

				// instanciating a Phaser.Game.Sprite objet for the entity
				sprite = phaserGame.add.sprite(0, 0, spriteId),

				// fomring the DataObject instance from the preloaded JSON file
				dataObject = new DataObject(phaserGame.cache.getJSON(config.id));

			// passing the team Id from the config param object
			dataObject.setTeam( team );

			entities.push( new Entity(this, sprite, dataObject) );

			group.add(sprite);
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

		unselectAll: function(){
			this.get().forEach(function(entity){
				if (entity.isSelected()){
					entity.unselect();
				}
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

		isEntityControlledByUser: function(entity) {
			if (!entity || 'function' !== typeof entity.getDataObject){
				throw 'Fitst parameter must be a valid entity object!';
			}
			return entity.getDataObject().getTeam() === PlayerManager.getInstance().getUser().getTeam();
		},

		getMaxSelectableUnitNumber: function(){
			return MAX_SELECTABLE_UNITS;
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