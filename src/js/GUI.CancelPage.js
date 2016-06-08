define('GUI.CancelPage', ['GUI.ControlPage', 'Util', 'json!abilities'], function(ControlPage, Util, abilitiesJSON) {

    var
    // reference to the shared game configuarition object 
        ns = window.fivenations;

    /**
     * Constructing an a custom CommandPage that consists solely one cancel button
     * @param {object} [entityManager] [sinleton like object that can be used to quiery all the entities]
     * @return {object} [ControlPanelPage]
     */
    function CancelPage(entityManager) {

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
    CancelPage.prototype.populate = function() {
        var button;

        button = this.createControlButton(abilitiesJSON.cancel);
        button.setCoords(0, 0);

        this.addControlButton(button);
    };

    /**
     * Override the original function with a no-op
     * @param  {[Array]} entities [Array of Entity instances]
     * @return {[void]}
     */
    CancelPage.prototype.update = function(entities) { /* no-op */ };

    return CancelPage;

});