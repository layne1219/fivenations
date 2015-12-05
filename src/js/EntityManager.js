define('EntityManager', ['Entity'], function(Entity){
	
	// intentionally hiding these variables from the outside world
	var phaser_game,
		singleton,

		// unique indentifier for maintaning the units in an array
		id = 0,

		// Array for storing all the entities on the map
		entities = [];


	function EntityManager(){
		if (!phaser_game){
			throw 'Invoke setGame first to pass the Phaser Game entity!';
		}		
		this.game = phaser_game;
	}

	EntityManager.prototype = {

		add: function(entity_id){
			
			var sprite = this.game.add.sprite(0, 0, 'test-ship');
			entities.push( new Entity(this, sprite) );

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