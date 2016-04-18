define('GUI.ControlPage', ['GUI.ControlButton', 'Util', 'json!abilities'], function(ControlButton, Util, abilitiesJSON){

	var COLUMNS = 5,
		ROWS = 5,
		ICON_WIDTH = 40,
		ICON_HEIGHT = 40,
		MARGIN = 0,

		// reference to the shared game configuarition object 
		ns = window.fivenations,		

		buttonNumber = ROWS * COLUMNS;

	/**
	 * Constructing an a ControlPanelPage that consists the clickable command buttons
	 * @return {object} [ControlPanelPage]
	 */
	function ControlPanelPage(){
		var args = [].slice.call(arguments);

		// applying the inherited constructor function
		Phaser.Group.apply(this, args);

		// initialising the buttons
		this.init();
	}

	// Making the prototype inherited from Phaser.Group prototype
	ControlPanelPage.prototype = Object.create(Phaser.Group.prototype);
	ControlPanelPage.prototype.constructor = ControlPanelPage;

	/**
	 * Setting up the table of command buttons
	 * @return {void}
	 */
	ControlPanelPage.prototype.init = function(){
		var i, x, y,
			button;

		this.buttons = [];

		for (i = 0; i < buttonNumber ; i++) {
			x = i % COLUMNS * ( ICON_WIDTH + MARGIN );
			y = Math.floor(i / COLUMNS) * ( ICON_HEIGHT + MARGIN );

			button = new ControlButton(x, y);
			button.events.onInputUp.add(function(idx){
				if (abilitiesJSON.cancel === this.getId()){
					ns.gui.selectedControlButton = null;
				} else {
					ns.gui.selectedControlButton = this.getId();
				}
			}.bind(button));

			this.buttons.push( this.add( button ));
		}
	};


	/**
	 * Updating the page according to the currently selected collection of entities
	 * @param  {[Array]} entities [Array of Entity instances]
	 * @return {[void]}
	 */
	ControlPanelPage.prototype.update = function(entities){
		if (!entities){
			return;
		}

		if (ns.gui.selectedControlButton){
			this.buttons.forEach(function(button, idx){
				if (0 === idx){
					button.visible = true;
					button.setId(abilitiesJSON.cancel);
				} else {
					button.visible = false;
				}
			});					
		} else {
			this.buttons.forEach(function(button, i){
				button.visible = true;
				button.setId(abilitiesJSON.move);
			});
		}
	};

	return ControlPanelPage;
	
});