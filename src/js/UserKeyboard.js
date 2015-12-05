define('UserKeyboard', ['Util'], function(Util){
	
	var singleton,
		phaser_game,
		dispatcher;

	function UserKeyboard(){
		init.call(this);
		registerEventListeners.call(this);
	}

	function init(){
		dispatcher = new Util.EventDispatcher;
	}

	function registerEventListeners(){

	}

	UserKeyboard.prototype = {

		on: function(event, callback){
			dispatcher.addEventListener(event, callback);
		},

		isDown: function(keyCode){
			return phaser_game.input.keyboard.isDown(keyCode);
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
				singleton = new UserKeyboard();
			}
			return singleton;
		}

	};



});