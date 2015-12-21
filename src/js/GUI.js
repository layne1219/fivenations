define('GUI', ['UserPointer', 'UserKeyboard', 'Util'], function(UserPointer, UserKeyboard, Util){

	var phaser_game,
		singleton,

		// setting up the frames for the individual GUI animations
		animations = (function(){

			return {
				
			}

		})();

	function GUI(){

	}

	GUI.prototype = {

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
				singleton = new GUI();
			}
			return singleton;
		}		

	};


});