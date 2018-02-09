/* global window */
import GUI from '../preloader/GUI';
import Starfield from '../preloader/Starfield';
import Entities from '../preloader/Entities';
import Wreckages from '../preloader/Wreckages';
import Effects from '../preloader/Effects';
import Projectiles from '../preloader/Projectiles';
import Audio from '../preloader/Audio';
import Translations from '../preloader/Translations';
import Maps from '../preloader/Maps';

const ns = window.fivenations;
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
  Audio.load(preloader);
  Translations.load(preloader);
  Maps.load(preloader);
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
    const gameWidth = ns.window.width;
    const gameHeight = ns.window.height;
    const popupWidth = 847;
    const popupHeight = 598;
    const popupX = (gameWidth - popupWidth) / 2;
    const popupY = (gameHeight - popupHeight) / 2;
    const barOffsetX = 132;
    const barOffsetY = 558;

    this.game.add.sprite(0, 0, 'preloader-background');
    this.game.add.sprite(popupX, popupY, 'preloader-popup');

    const bar = this.add.sprite(
      popupX + barOffsetX,
      popupY + barOffsetY,
      'preloader-bar',
    );
    this.load.setPreloadSprite(bar);

    // setting up the callback one the preloading is completed
    this.load.onLoadComplete.addOnce(() => {
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
