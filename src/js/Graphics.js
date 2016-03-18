define('Graphics', ['Util'], function(Util){

	var phaserGame,
		singleton;

	function createGraphicsInstance(){

		var groups = {},
			// layers ordered as follows
			groupNames = [
				'starfield',
				'selectors',
				'entities'
			];

		groupNames.forEach(function(name){
			groups[name] = phaserGame.add.group();
		});

		return {

			getGroup: function(id){
				if (!id){
					throw 'Invalid Id to retrieve a group!';
				}
				return groups[id];
			}

		};

	}

	return {

		setGame: function(game){
			phaserGame = game;
		},

		/**
		 * Accessing the singleton instance of the GUI 
		 * @return {object} GUI
		 */
		getInstance: function(){
			if (!phaserGame){
				throw 'Invoke setGame first to pass the Phaser Game entity!';
			}			
			if (!singleton){
				singleton = createGraphicsInstance();
			}
			return singleton;
		}

	};

});