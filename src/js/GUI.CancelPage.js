define('GUI.CancelPage', ['GUI.ControlPage', 'Util', 'json!abilities'], function(ControlPage, Util, abilitiesJSON){

	var
		// reference to the shared game configuarition object 
		ns = window.fivenations,
		BUTTON_NUMBER = 1;

	/**
	 * Constructing an a custom CommandPage that consists solely one cancel button
	 * @param {[object]} [controlPanel] [instance of the parent object wrapping this instance]
	 * @return {object} [CancelPage]
	 */
	function CancelPage(controlPanel){
		var args = [].slice.call(arguments);

		// applying the inherited constructor function
		Phaser.Group.apply(this, args);

		// initialising the buttons
		this.init(controlPanel);
	}

	// Making the prototype inherited from Phaser.Group prototype
	CancelPage.prototype = Object.create(Phaser.Group.prototype);
	CancelPage.prototype.constructor = CancelPage;

	/**
	 * Setting up the table of command buttons
	 * @return {void}
	 */
	CancelPage.prototype.populate = function(){
		var i, x, y,
			button;

		button = new ControlButton(x, y);
		button.setId(abilitiesJSON.cancel);
		button.events.onInputUp.add(function(idx){
			this.activate(this.getParent());
			if (ns.gui.selectedControlButton){
				ns.gui.selectedControlButton.deactivate(this.getParent());
			}
			ns.gui.selectedControlButton = this;
		}.bind(button));

		this.buttons.push( this.add( button ));
	};

	return CancelPage;
	
});