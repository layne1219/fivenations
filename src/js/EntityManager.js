define('EntityManager', ['Entity', 'DataObject'], function(Entity, DataObject){
	
	var ns = window.fivenations,

		phaser_game,
		singleton,

		// unique indentifier for maintaning the units in an array
		id = 0,

		// Array for storing all the entities generated 
		entities = [];


	function EntityManager(){
		if (!phaser_game){
			throw 'Invoke setGame first to pass the Phaser Game entity!';
		}		
		this.game = phaser_game;
	}

	EntityManager.prototype = {

		add: function(entity_id){
			
			if (Object.keys(ns.entities).indexOf(entity_id) === -1){
				throw "The requrested entity is not registered!";
			}

			var sprite = this.game.add.sprite(0, 0, entity_id),
				dataObject = new DataObject(this.game.cache.getJSON(entity_id));

			entities.push( new Entity(this, sprite, dataObject) );

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
			return this.game;
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
		}		
	};

	return {

		setGame: function(game){
			phaser_game = game;
		},

		getInstance: function(){
			if (!phaser_game){
				throw 'Invoke setGame first to pass the Phaser Game entity!';
			}			
			if (!singleton){
				singleton = new EntityManager();
			}
			return singleton;
		}

	};

});