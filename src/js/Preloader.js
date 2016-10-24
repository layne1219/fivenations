define('Preloader', ['Preloader.Entities'], function(preloaderEntities) {
    'use strict';

    var preloader;

    /**
     * Private function to set up all the assets needs to be loaded before the game starts
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    function loadResources(preloader) {
        loadGUI(preloader);
        loadStarfield(preloader);
        preloaderEntities.load(preloader);
    }

    /**
     * Loading assets for the in-game GUI
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    function loadGUI(preloader) {
        preloader.load.atlasJSONHash('gui', 'assets/images/gui/GUI_element.png', 'assets/images/gui/GUI_element.json');
        preloader.load.atlasJSONHash('gui.icons.fed', 'assets/images/gui/fed_icons.png', 'assets/images/gui/fed_icons.json');
        preloader.load.atlasJSONHash('gui.icons.ath', 'assets/images/gui/ath_icons.png', 'assets/images/gui/ath_icons.json');
        preloader.load.atlasJSONHash('gui.icons.syl', 'assets/images/gui/syl_icons.png', 'assets/images/gui/syl_icons.json');
        preloader.load.atlasJSONHash('gui.icons.obj', 'assets/images/gui/obj_icons.png', 'assets/images/gui/obj_icons.json');
    }

    /**
     * Loading assets for the starfield object displaying the parallax background
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    function loadStarfield(preloader) {
        preloader.load.image('starfield', 'assets/images/starfield/starfield.jpg');
        preloader.load.image('starfield.star.big-1', 'assets/images/starfield/star-s-1.png');
        preloader.load.image('starfield.star.big-2', 'assets/images/starfield/star-s-2.png');
        preloader.load.image('starfield.star.big-3', 'assets/images/starfield/star-s-3.png');
        preloader.load.image('starfield.star.small-1', 'assets/images/starfield/star-m-1.png');
        preloader.load.image('starfield.star.small-2', 'assets/images/starfield/star-m-2.png');
        preloader.load.image('starfield.star.small-3', 'assets/images/starfield/star-m-3.png');
        preloader.load.atlasJSONHash('starfield.clouds.bg.type-1', 'assets/images/starfield/background_clouds_type01.png', 'assets/images/starfield/background_clouds_type01.json');
        preloader.load.atlasJSONHash('starfield.clouds.bg.type-2', 'assets/images/starfield/background_clouds_type02.png', 'assets/images/starfield/background_clouds_type02.json');
        preloader.load.atlasJSONHash('starfield.planets.type-1', 'assets/images/starfield/background_planets01.png', 'assets/images/starfield/background_planets01.json');
        preloader.load.atlasJSONHash('starfield.planets.type-2', 'assets/images/starfield/background_planets02.png', 'assets/images/starfield/background_planets02.json');
        preloader.load.atlasJSONHash('starfield.meteorites', 'assets/images/starfield/background_planets02_meteorites.png', 'assets/images/starfield/background_meteorites.json');
    }

    /**
     * Preloader object used for asyncroniously download assets for the game
     */
    function Preloader() {
        this.ready = false;
    }

    Preloader.prototype = {
        /**
         * @return {void}
         */
        preload: function() {
            preloader = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
            this.load.setPreloadSprite(preloader);

            // setting up the callback one the preloading is completed
            this.load.onLoadComplete.addOnce(function() {
                this.ready = true;
            }, this);

            // line up all the reasources waiting for being preloaded
            loadResources(this);

        },

        /**
         * @return {void}
         */
        create: function() {

        },

        /**
         * @return {void}
         */
        update: function() {
            if (this.ready) {
                this.game.state.start('menu');
            }
        }

    };

    return Preloader;
});