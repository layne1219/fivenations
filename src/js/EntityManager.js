define('EntityManager', ['Entity', 'DataObject'], function(Entity, DataObject){
	
	var ns = window.fivenations,

		phaserGame,
		singleton,

		// unique indentifier for maintaning the units in an array
		id = 0,

		// Array for storing all the entities generated 
		entities = [],

		// reference to a Phaser.Group
		group;


	function EntityManager(){
		if (!phaserGame){
			throw 'Invoke setGame first to pass the Phaser Game entity!';
		}
		group = phaserGame.add.group();
	}

	EntityManager.prototype = {

		add: function(entity_id){
			
			if (Object.keys(ns.entities).indexOf(entity_id) === -1){
				throw "The requrested entity is not registered!";
			}

			var sprite = phaserGame.add.sprite(0, 0, entity_id),
				dataObject = new DataObject(phaserGame.cache.getJSON(entity_id));

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