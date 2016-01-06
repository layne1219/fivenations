define('UserKeyboard', ['Util'], function(Util){
	
	var singleton,
		phaserGame,
		dispatcher,
		cursors;

	function UserKeyboard(){
		init.call(this);
		registerEventListeners.call(this);
	}

	function init(){
		dispatcher = new Util.EventDispatcher;
		// handling the curser key events
		cursors = phaserGame.input.keyboard.createCursorKeys();		
	}

	function registerEventListeners(){

	}

	function scrollWithCursors(){
	    if (cursors.up.isDown){
	        phaserGame.camera.y -= 10;
	    }
	    else if (cursors.down.isDown){
	        phaserGame.camera.y += 10;
	    }

	    if (cursors.left.isDown){
	        phaserGame.camera.x -= 10;
	    } else if (cursors.right.isDown){
	        phaserGame.camera.x += 10;
	    }   
	}	

	UserKeyboard.prototype = {

		on: function(event, callback){
			dispatcher.addEventListener(event, callback);
		},

		isDown: function(keyCode){
			return phaserGame.input.keyboard.isDown(keyCode);
		},

		update: function(){
			scrollWithCursors();
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
				singleton = new UserKeyboard();
			}
			return singleton;
		}		

	};



});