/* global window */
import Menu from '../preloader/Menu';

const ns = window.fivenations;

/**
 * Private function to set up all the assets needs to be loaded before the game starts
 * @param {object} [preloader] Preloader object defined below
 */
function loadResources(preloader) {
  Menu.load(preloader);
}

/**
 * Preloader object used for asyncroniously download assets for the game
 */
class MenuPreloader {
  constructor() {
    this.ready = false;
  }

  /**
   * Starts preloading process
   */
  preload() {
    const gameWidth = ns.window.width;
    const gameHeight = ns.window.height;
    const popupWidth = 726;
    const popupHeight = 598;
    const popupX = (gameWidth - popupWidth) / 2;
    const popupY = (gameHeight - popupHeight) / 2;
    const barOffsetX = 92;
    const barOffsetY = 558;
    const backgroundX = (gameWidth - 1024) / 2;
    const backgroundY = 0;

    this.game.add.sprite(backgroundX, backgroundY, 'preloader-background');
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
  }

  /**
   * @return {void}
   */
  update() {
    if (this.ready) {
      this.game.state.start('mainmenu');
    }
  }
}

export default MenuPreloader;
