define('GUI.ControlPage', ['GUI.ControlButton', 'Util', 'json!abilities'], function(ControlButton, Util, abilitiesJSON){

	var COLUMNS = 5,
		ROWS = 5,
		ICON_WIDTH = 40,
		ICON_HEIGHT = 40,
		MARGIN = 0,

		// reference to the shared game configuarition object 
		ns = window.fivenations,		

		BUTTON_NUMBER = ROWS * COLUMNS;

	/**
	 * Constructing an a ControlPanelPage that consists the clickable command buttons
	 * @param {[object]} [controlPanel] [instance of the parent object wrapping this instance]
	 * @return {object} [ControlPanelPage]
	 */
	function ControlPanelPage(controlPanel){
		var args = [].slice.call(arguments);

		// applying the inherited constructor function
		Phaser.Group.apply(this, args);

		// initialising the buttons
		this.init(controlPanel);

		this.populate();
	}

	// Making the prototype inherited from Phaser.Group prototype
	ControlPanelPage.prototype = Object.create(Phaser.Group.prototype);
	ControlPanelPage.prototype.constructor = ControlPanelPage;

	/**
	 * Setting up the table of command buttons
	 * @param {[object]} [controlPanel] [instance of the parent object wrapping this instance]
	 * @return {void}
	 */
	ControlPanelPage.prototype.init = function(controlPanel){
		var i, x, y,
			button;

		this.parent = controlPanel;
		this.buttons = [];

	};

	/**
	 * Createing the ControlButtons and moving them to their right position
	 * @return {[void]}
	 */
	ControlPanelPage.prototype.populate = function(){
		for (i = 0; i < BUTTON_NUMBER ; i++) {
			x = i % COLUMNS * ( ICON_WIDTH + MARGIN );
			y = Math.floor(i / COLUMNS) * ( ICON_HEIGHT + MARGIN );

			button = new ControlButton(x, y);
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
	};

	/**
	 * Returns with the ControlPanel instance incorporating this very page instance
	 * @return {[object]} [ControlPanel]
	 */
	ControlPanelPage.prototype.getParent = function(){
		return this.parent;
	};

	return ControlPanelPage;
	
});