/* global window, Phaser */
import Button from './Button';

const ns = window.fivenations;

let fullScreenButton;
let disableFullScreenButton;

/**
 * Imitates a Toogle button to switch between Full-Screen and normal mode.
 * It incorporates two separate buttons laying on top of one another.
 */
class FullScreenToggle extends Phaser.Group {
  /**
   * Instantiate the toogle with the given configuration
   * @param {object} config - {x, y}
   */
  constructor(config) {
    const { game } = ns.game;
    super(game);
    this.initFullScreenScaleMode();
    this.initFullScreenButton();
    this.initDisableFullScreenButton();
    this.setCoordinates(config);
  }

  /**
   * Defines the scaling mode for full-screen
   */
  initFullScreenScaleMode() {
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scaleMode = this.game.scale.fullScreenScaleMode;
  }

  /**
   * Creates the button to toggle the game to Full-Screen mode
   */
  initFullScreenButton() {
    fullScreenButton = new Button({
      customOverFrame: 'roundbtn_fullscreen_oclick.png',
      customDownFrame: 'roundbtn_fullscreen_oclick.png',
      customOutFrame: 'roundbtn_fullscreen_base.png',
      spritesheet: 'gui.buttons',
      onClick: () => {
        this.game.scale.startFullScreen(false);
        fullScreenButton.visible = false;
        disableFullScreenButton.visible = true;
      },
    });
    this.add(fullScreenButton);
  }

  /**
   * Creates the button to toggle the game back to normal mode
   */
  initDisableFullScreenButton() {
    disableFullScreenButton = new Button({
      customOverFrame: 'roundbtn_invers_fullscreen_onclick.png',
      customDownFrame: 'roundbtn_invers_fullscreen_onclick.png',
      customOutFrame: 'roundbtn_invers_fullscreen_base.png',
      spritesheet: 'gui.buttons',
      onClick: () => {
        this.game.scale.stopFullScreen();
        fullScreenButton.visible = true;
        disableFullScreenButton.visible = false;
      },
    });
    disableFullScreenButton.visible = false;
    this.add(disableFullScreenButton);
  }

  /**
   * Sets the coordinates based on the passed object that must contain
   * at least x and y attributes
   * @param {object} - x, y
   */
  setCoordinates({ x, y }) {
    this.x = x;
    this.y = y;
    this.fixedToCamera = true;
    this.cameraOffset.setTo(x, y);
  }
}

export default FullScreenToggle;
