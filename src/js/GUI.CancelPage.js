define('GUI.CancelPage', ['GUI.ControlPage', 'Util', 'json!abilities'], function(ControlPage, Util, abilitiesJSON){

	var
		// reference to the shared game configuarition object 
		ns = window.fivenations;

	/**
	 * Constructing an a custom CommandPage that consists solely one cancel button
	 * @param {object} [entityManager] [sinleton like object that can be used to quiery all the entities]
	 * @return {object} [ControlPanelPage]
	 */
	function CancelPage(entityManager){

		// applying the inherited constructor function
		ControlPage.call(this, entityManager);
	}	

	// Making the prototype inherited from Phaser.Group prototype
	CancelPage.prototype = Object.create(ControlPage.prototype);
	CancelPage.prototype.constructor = CancelPage;

	/**
	 * Setting up the table of command buttons
	 * @return {void}
	 */
	CancelPage.prototype.populate = function(){
		var button;

		button = new ControlButton(this.entityManager);
		button.setCoords(0, 0);
		button.setId(abilitiesJSON.cancel);

		this.buttons.push( this.add( button ));
	};

	return CancelPage;
	
});