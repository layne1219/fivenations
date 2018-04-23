/* global Phaser */
import FVLoader from '../common/FVLoader';
import Translations from '../preloader/Translations';
import TranslationManager from '../common/TranslationManager';

const { PUBLIC_URL } = process.env;
const PATH_ASSETS = `${PUBLIC_URL}/assets/images/gui`;

function Boot() {}

Boot.prototype = {
  init() {
    // swap Phaser.Loader for our custom one
    // @see https://hacks.mozilla.org/2016/06/webfont-preloading-for-html5-games/
    this.game.load = new FVLoader(this.game);
  },

  preload() {
    this.game.load.crossOrigin = 'anonymous';
    this.game.load.image(
      'preloader-background',
      `${PATH_ASSETS}/preload_background.jpg`,
    );
    this.game.load.image('preloader-bar', `${PATH_ASSETS}/preload_bar.png`);
    this.game.load.image('preloader-popup', `${PATH_ASSETS}/preload_popup.png`);
    this.game.load.webfont('conthraxsemibold', 'conthraxsemibold');

    Translations.load(this.game);

    // setting up the callback one the preloading is completed
    this.game.load.onLoadComplete.addOnce(() => {
      this.game.state.start('game-preloader');
    }, this);
  },

  create() {
    TranslationManager.setGame(this.game);

    // preventing the context menu to appear when the user clicks with the right mouse button
    this.game.canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };

    // configure game
    this.game.input.maxPointers = 1;

    if (this.game.device.desktop) {
      this.game.scale.pageAlignHorizontally = true;
    } else {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth = 480;
      this.game.scale.minHeight = 260;
      this.game.scale.maxWidth = 640;
      this.game.scale.maxHeight = 480;
      this.game.scale.forceOrientation(true);
      this.game.scale.pageAlignHorizontally = true;
    }
  },
};

export default Boot;
