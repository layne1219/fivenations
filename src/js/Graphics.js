define('Graphics', ['Util'], function(Util){

	var phaserGame,
		singleton,

		maxGroups = 10;

	function createGraphicsInstance(){

		var groups = [];

		while (groups.length < maxGroups){
			groups.push( phaserGame.add.group() );
		}

		return {

			getGroup: function(zIndex){
				if (Util.between(zIndex, 0, 9)){
					zIndex = 0;
				}
				return group[parseInt(zIndex)];
			}

		}

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

	}



});