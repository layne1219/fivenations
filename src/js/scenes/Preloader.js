import GUI from '../preloader/GUI';
import Starfield from '../preloader/Starfield';
import Entities from '../preloader/Entities';
import Wreckages from '../preloader/Wreckages';
import Effects from '../preloader/Effects';
import Projectiles from '../preloader/Projectiles';

/**
 * Private function to set up all the assets needs to be loaded before the game starts
 * @param {object} [preloader] Preloader object defined below
 * @return {void}
 */
function loadResources(preloader) {
    GUI.load(preloader);
    Starfield.load(preloader);
    Entities.load(preloader);
    Wreckages.load(preloader);
    Effects.load(preloader);
    Projectiles.load(preloader);
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
        const preloaderSprite = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
        this.load.setPreloadSprite(preloaderSprite);

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

export default Preloader;
