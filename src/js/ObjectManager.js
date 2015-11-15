define('ObjectManager', function(){
	
	// intentionally hiding these variables from the outside world
	var game,
		singleton,

		objects = [];

	function ObjectManager(){

	}

	ObjectManager.prototype = {

		add: function(uid){
			
		},

		remove: function(object){
			for (var i = objects.length - 1; i >= 0; i--) {
				if (object === objects[i]){
					objects.splice(i, 1);
				}
			}
			object = null;
			delete object;
		},

		get: function(id){
			for (var i = objects.length - 1; i >= 0; i--) {
				if (id === objects[i].getId()){
					return objects[i];
				} 
			}
			return null;
		},

		getAll: function(){
			return objects;
		},
		
		reset: function(){
			objects = [];
		}

	};

	return {

		setGame: function(phaser_game){
			game = phaser_game;
		},

		getInstance: function(){
			if (!game){
				throw 'Invoke setGame first to pass the Phaser Game object!';
			}
			if (!singleton){
				singleton = new ObjectManager();
			}
			return singleton;
		}

	};

});