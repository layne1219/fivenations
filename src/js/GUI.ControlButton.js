define('GUI.ControlButton', ['Util'], function(Util){

	var GUI_FRAME_OFFSET = 65,
		PADDING_ONCLICK = 2,
		TRANSPARENCY_ONLICK = 0.75,

		// reference to the shared game configuarition object 
		ns = window.fivenations;

	/**
	 * Constructing an a ControlPanelPage that consists the clickable command buttons
	 * @param {[integer]} [x] [horizontal padding from 0,0]
	 * @param {[integer]} [y] [vertical padding from 0,0]
	 * @return {object} [ControlPanelPage]
	 */
	function ControlPanelButton(x, y){
		var args = [].slice.call(arguments);

		// applying the inherited constructor function
		Phaser.Sprite.call(this, ns.game, x, y, 'gui');

		// initialising the buttons
		this.init();

		// applying default event handlers on the generated instance
		this.addEventListeners();

		// activating custom behaviour upon click
		this.addBehaviour();
	}

	// Making the prototype inherited from Phaser.Group prototype
	ControlPanelButton.prototype = Object.create(Phaser.Sprite.prototype);
	ControlPanelButton.prototype.constructor = ControlPanelButton;

	/**
	 * Adding the Sprite object to the Game stage
	 * @return {void}
	 */
	ControlPanelButton.prototype.init = function(){
		ns.game.add.existing(this);
		this.inputEnabled = true;
		this.frame = GUI_FRAME_OFFSET;
	};


	/**
	 * Adding all the default event listeners
	 * @return {[void]}
	 */
	ControlPanelButton.prototype.addEventListeners = function(){
		var origY = this.y;
		this.events.onInputDown.add(function(){
			this.y += PADDING_ONCLICK;
			this.alpha = TRANSPARENCY_ONLICK;
		}.bind(this));
		this.events.onInputUp.add(function(){
			this.y = origY;
			this.alpha = 1;
		}.bind(this));				
	};

	/**
	 * Add event listeners to the ControlButton
	 * @param {[type]} button [description]
	 */
	ControlPanelPage.prototype.addBehaviour = function(){
		this.events.onInputUp.add(function(idx){
			var controlPanel = this.getParent().getParent();
			this.activate(controlPanel);
				if (ns.gui.selectedControlButton){
					ns.gui.selectedControlButton.deactivate(controlPanel);
				}
			ns.gui.selectedControlButton = this;	
		}.bind(this));

	};

	/**
	 * Updating the button based on the passed entities
	 * @param  {object} entities
	 * @return {void}
	 */
	ControlPanelButton.prototype.update = function(entities){
		if (!entities){
			return;
		}
	};

	ControlPanelButton.prototype.activate = function(){

	};

	ControlPanelButton.prototype.deactivate = function(){

	};	

	/**
	 * Setting the ID of the button which determines what the click callback will do
	 * @return {void}
	 */
	ControlPanelButton.prototype.setId = function(id){
		this.frame = this.id = id;
	};

	/**
	 * Obtaining the Id the button is set up to 
	 * @return {[Integer]}	Ability Identifier the button represent
	 */
	ControlPanelButton.prototype.getId = function(){
		return this.id;
	};		

	return ControlPanelButton;	
});