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
	function ControlPanelButton(id){
		var args = [].slice.call(arguments);

		// applying the inherited constructor function
		Phaser.Sprite.call(this, ns.game, 0, 0, 'gui');

		// initialising the buttons
		this.init(id);

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
	ControlPanelButton.prototype.init = function(id){
		ns.game.add.existing(this);
		this.inputEnabled = true;
		this.setId(id);
	};


	/**
	 * Adding all the default event listeners
	 * @return {[void]}
	 */
	ControlPanelButton.prototype.addEventListeners = function(){
		this.events.onInputDown.add(function(){
			this.y += PADDING_ONCLICK;
			this.alpha = TRANSPARENCY_ONLICK;
		}.bind(this));
		this.events.onInputUp.add(function(){
			this.y -= PADDING_ONCLICK;
			this.alpha = 1;
		}.bind(this));				
	};

	/**
	 * Add event listeners to the ControlButton
	 * @param {[type]} button [description]
	 */
	ControlPanelButton.prototype.addBehaviour = function(){
		this.events.onInputUp.add(function(idx){
			var controlPanel = this.parent.parent;
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
		if (entities){
			
		}
		return this;
	};

	/**
	 * No-op function for inheritance
	 * @return {[void]}
	 */
	ControlPanelButton.prototype.activate = function(){
		return this;
	};

	/**
	 * No-op function for inheritance
	 * @return {[void]}
	 */
	ControlPanelButton.prototype.deactivate = function(){
		return this;
	};	

	/**
	 * Setting the ID of the button which determines what the click callback will do
	 * @return {void}
	 */
	ControlPanelButton.prototype.setId = function(id){
		this.frame = this.id = id;
		return this;
	};

	/**
	 * Set the coordinates of the sprite instance
	 * @param {[type]} x [horizontal padding on the control page]
	 */
	ControlPanelButton.prototype.setX = function(x){
		this.x = x;
		return this;
	};

	/**
	 * Set the coordinates of the sprite instance
	 * @param {[type]} y [vertical padding on the control page]
	 */
	ControlPanelButton.prototype.setY = function(y){
		this.y = y;
		return this;
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