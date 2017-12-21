import GUI from '../preloader/GUI';
import Starfield from '../preloader/Starfield';
import Entities from '../preloader/Entities';
import Wreckages from '../preloader/Wreckages';
import Effects from '../preloader/Effects';
import Projectiles from '../preloader/Projectiles';

let background;
let bar;

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
  preload() {
    background = this.game.add.sprite(0, 0, 'preloader-background');
    background.fixedToCamera = true;

    bar = this.add.sprite(326, 633, 'preloader-bar');
    this.load.setPreloadSprite(bar);

    // setting up the callback one the preloading is completed
    this.load.onLoadComplete.addOnce(function () {
      this.ready = true;
    }, this);

    // line up all the reasources waiting for being preloaded
    loadResources(this);
  },

  /**
   * @return {void}
   */
  create() {},

  /**
   * @return {void}
   */
  update() {
    if (this.ready) {
      this.game.state.start('game');
    }
  },
};

export default Preloader;
