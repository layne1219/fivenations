/* global Phaser */
const { PUBLIC_URL } = process.env;
const PATH_ASSETS = `${PUBLIC_URL}/assets/images/gui`;

function Boot() {}

Boot.prototype = {
  preload() {
    this.load.crossOrigin = 'anonymous';
    this.load.image(
      'preloader-background',
      `${PATH_ASSETS}/preload_background.jpg`,
    );
    this.load.image('preloader-bar', `${PATH_ASSETS}/preload_bar.png`);
    this.load.image('preloader-popup', `${PATH_ASSETS}/preload_popup.png`);
  },

  create() {
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
    this.game.state.start('menu-preloader');
  },
};

export default Boot;
