define('UserKeyboard', ['Util'], function(Util){
	
	var singleton,
		phaser_game,
		dispatcher,
		cursors;

	function UserKeyboard(){
		init.call(this);
		registerEventListeners.call(this);
	}

	function init(){
		dispatcher = new Util.EventDispatcher;
		// handling the curser key events
		cursors = phaser_game.input.keyboard.createCursorKeys();		
	}

	function registerEventListeners(){

	}

	function scrollWithCursors(){
	    if (cursors.up.isDown){
	        phaser_game.camera.y -= 10;
	    }
	    else if (cursors.down.isDown){
	        phaser_game.camera.y += 10;
	    }

	    if (cursors.left.isDown){
	        phaser_game.camera.x -= 10;
	    } else if (cursors.right.isDown){
	        phaser_game.camera.x += 10;
	    }        
	}	

	UserKeyboard.prototype = {

		on: function(event, callback){
			dispatcher.addEventListener(event, callback);
		},

		isDown: function(keyCode){
			return phaser_game.input.keyboard.isDown(keyCode);
		},

		update: function(){
			scrollWithCursors();
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