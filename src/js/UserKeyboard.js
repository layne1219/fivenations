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
		dispatcher = new Util.EventDispatcher();
		// handling the curser key events
		cursors = phaserGame.input.keyboard.createCursorKeys();		
	}

	function registerEventListeners(){

	}

	function listenToCursor(){
	    if (cursors.up.isDown){
	        dispatcher.dispatch('cursor/up');
	    }
	    else if (cursors.down.isDown){
	        dispatcher.dispatch('cursor/down');
	    }

	    if (cursors.left.isDown){
	        dispatcher.dispatch('cursor/left');
	    } else if (cursors.right.isDown){
	        dispatcher.dispatch('cursor/right');
	    }   
	}	

	UserKeyboard.prototype = {

		on: function(event, callback){
			dispatcher.addEventListener(event, callback);
			return this;
		},

		isDown: function(keyCode){
			return phaserGame.input.keyboard.isDown(keyCode);
		},

		update: function(){
			listenToCursor();
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