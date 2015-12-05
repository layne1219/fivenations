define('UserPointer', ['Util'], function(Util){
	
	var singleton,
		phaser_game,
		dispatcher;

	function UserPointer(){
		init.call(this);
		registerEventListeners.call(this);
	}

	function init(){
		dispatcher = new Util.EventDispatcher;
	}

	function registerEventListeners(){
		// Releasing either of the mouse buttons
		phaser_game.input.onUp.add(function(){
			dispatcher.dispatch("mouseup");
		}, this);

		// Pressing either of the mouse buttons
		phaser_game.input.onDown.add(function(){

            // left mouse button
            if (phaser_game.input.mousePointer.leftButton.isDown){
            	dispatcher.dispatch("leftmousedown");
            } 
            // right mouse button
            else if (phaser_game.input.mousePointer.rightButton.isDown){
            	dispatcher.dispatch("rightmousedown");
            }

            // invoking all the registred functions for the the unified event
			dispatcher.dispatch("mousedown");	

		}, this);

	}

	UserPointer.prototype = {

		on: function(event, callback){
			dispatcher.addEventListener(event, callback);
		},

		isLeftButtonDown: function(){
			return phaser_game.input.mousePointer.leftButton.isDown;
		},

		isRightButtonDown: function(){
			return phaser_game.input.mousePointer.rightButton.isDown;
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