define('GUI.ControlPage', [
    'GUI.ControlButton',
    'json!abilities'
], function(ControlButton, abilitiesJSON) {

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
     * @param {object} [entityManager] [sinleton like object that can be used to quiery all the entities]
     * @return {object} [ControlPanelPage]
     */
    function ControlPanelPage(entityManager) {

        // applying the inherited constructor function
        Phaser.Group.call(this, ns.game);

        // initialising the buttons
        this.init(entityManager);
    }

    // Making the prototype inherited from Phaser.Group prototype
    ControlPanelPage.prototype = Object.create(Phaser.Group.prototype);
    ControlPanelPage.prototype.constructor = ControlPanelPage;

    /**
     * Setting up the table of command buttons
     * @return {void}
     */
    ControlPanelPage.prototype.init = function(entityManager) {
        var i, x, y,
            button;

        this.buttons = [];
        this.entityManager = entityManager;

        this.populate();
    };

    /**
     * Createing the ControlButtons and moving them to their right position
     * @return {[void]}
     */
    ControlPanelPage.prototype.populate = function() {
        var button;
        for (i = 0; i < BUTTON_NUMBER; i++) {
            x = i % COLUMNS * (ICON_WIDTH + MARGIN);
            y = Math.floor(i / COLUMNS) * (ICON_HEIGHT + MARGIN);

            button = this.createControlButton();
            button.setCoords(x, y);

            this.addControlButton(button);
        }
    };

    /**
     * return a fresh instance of ControlButton
     * @param  {[integer]} id [Id of the button]
     * @return {[object]} [GUI.ControlButton]
     */
    ControlPanelPage.prototype.createControlButton = function(id) {
        button = new ControlButton(this.entityManager);
        if (id) {
            button.setId(id);
        }
        return button;
    };

    /**
     * Add ControlButton to the container
     * @param {[object]} GUI.ControlButton [attaching the ControlButton to the Phaser group layer]
     * @param {[void]}
     */
    ControlPanelPage.prototype.addControlButton = function(controlButton) {
        if (!controlButton) {
            throw 'Invalid ControlButton instance was passed as the first parameter!';
        }
        this.buttons.push(this.add(controlButton));
    };

    /**
     * Updating the page according to the currently selected collection of entities
     * @param  {[Array]} entities [Array of Entity instances]
     * @return {[void]}
     */
    ControlPanelPage.prototype.update = function(entities) {
        var abilities;
        if (!entities) {
            return;
        }
        abilities = this.parent.entityManager.getMergedAbilities(entities);
        this.buttons.forEach(function(button, idx) {
            if (!abilities[idx]) {
                button.visible = false;
            } else {
                button.setId(abilities[idx]);
                button.visible = true;
            }
        });
    };

    /**
     * return the control panel which incorporates all the available control pages
     * we need this reference to switch between pages from the button logic's scope
     * @return {[object]} [GUI.ControlPanel]
     */
    ControlPanelPage.prototype.getControlPanel = function() {
        return this.parent;
    };

    return ControlPanelPage;

});