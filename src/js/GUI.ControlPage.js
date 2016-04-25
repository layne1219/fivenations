define('GUI.ControlPage', [
	'GUI.ControlButton', 
	'json!abilities'
], function(ControlButton, abilitiesJSON){

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
	 * @return {object} [ControlPanelPage]
	 */
	function ControlPanelPage(){

		// applying the inherited constructor function
		Phaser.Group.call(this, ns.game);

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

		this.populate();
	};

	/**
	 * Createing the ControlButtons and moving them to their right position
	 * @return {[void]}
	 */
	ControlPanelPage.prototype.populate = function(){
		for (i = 0; i < BUTTON_NUMBER ; i++) {
			x = i % COLUMNS * ( ICON_WIDTH + MARGIN );
			y = Math.floor(i / COLUMNS) * ( ICON_HEIGHT + MARGIN );

			button = new ControlButton(abilitiesJSON.move);
			button.setX(x)
				  .setY(y);

			this.buttons.push( this.add( button ));
		}
	};

	/**
	 * Updating the page according to the currently selected collection of entities
	 * @param  {[Array]} entities [Array of Entity instances]
	 * @return {[void]}
	 */
	ControlPanelPage.prototype.update = function(entities){
		var abilities;
		if (!entities){
			return;
		}
		abilities = this.parent.entityManager.getMergedAbilities(entities);
		this.buttons.forEach(function(button, idx){
			if (!abilities[idx]){
				button.visible = false;
			} else {
				button.setId(abilities[idx]);
				button.visible = true;
			}
		});
	};

	return ControlPanelPage;
	
});