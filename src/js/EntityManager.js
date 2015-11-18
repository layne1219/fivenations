define('EntityManager', function(){
	
	// intentionally hiding these variables from the outside world
	var game,
		singleton,

		entities = [];

	function EntityManager(){

	}

	ObjectManager.prototype = {

		add: function(uid){
			
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

		get: function(id){
			for (var i = entities.length - 1; i >= 0; i--) {
				if (id === entities[i].getId()){
					return entities[i];
				} 
			}
			return null;
		},

		getAll: function(){
			return entities;
		},
		
		reset: function(){
			entities = [];
		}

	};

	return {

		setGame: function(phaser_game){
			game = phaser_game;
		},

		getInstance: function(){
			if (!game){
				throw 'Invoke setGame first to pass the Phaser Game entity!';
			}
			if (!singleton){
				singleton = new ObjectManager();
			}
			return singleton;
		}

	};

});