define('UserPointer', ['Util'], function(Util){
	
	var singleton,
		phaser_game,
		dispatcher;

	function UserPointer(){
		init.call(this);
	}

	function init(){
		dispatcher = new Util.EventDispatcher;

		phaser_game.input.onDown.add(function(){
			dispatcher.dispatch('mousedown');
		}, this);
		
		phaser_game.input.onUp.add(function(){
			dispatcher.dispatch('mouseup');
		}, this);		
	}

	UserPointer.prototype = {

		on: function(event, callback){
			dispatcher.addEventListener(event, callback);
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
				singleton = new UserPointer();
			}
			return singleton;
		}

	};



});