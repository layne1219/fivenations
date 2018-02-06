/* global window, Phaser */
import Button from './Button';

const ns = window.fivenations;

let muteAudioButton;
let unmuteAudioButton;

/**
 * Imitates a Toogle button to switch between Full-Screen and normal mode.
 * It incorporates two separate buttons laying on top of one another.
 */
class AudioToggle extends Phaser.Group {
  /**
   * Instantiate the toogle with the given configuration
   * @param {object} config - {x, y}
   */
  constructor(config) {
    const { game } = ns.game;
    super(game);
    this.initMuteAudioButton();
    this.initUnmuteButton();
    this.setCoordinates(config);
  }

  /**
   * Creates the button to toggle the game to Full-Screen mode
   */
  initMuteAudioButton() {
    const { game } = ns.game;
    muteAudioButton = new Button({
      customOverFrame: 'roundbtn_mute_onclick.png',
      customDownFrame: 'roundbtn_mute_onclick.png',
      customOutFrame: 'roundbtn_mute_base.png',
      spritesheet: 'gui.buttons',
      onClick: () => {
        game.sound.volume = 0;
        muteAudioButton.visible = false;
        unmuteAudioButton.visible = true;
      },
    });
    this.add(muteAudioButton);
  }

  /**
   * Creates the button to toggle the game back to normal mode
   */
  initUnmuteButton() {
    const { game } = ns.game;
    unmuteAudioButton = new Button({
      customOverFrame: 'roundbtn_mutebtb_invers_onclick.png',
      customDownFrame: 'roundbtn_mutebtb_invers_onclick.png',
      customOutFrame: 'roundbtn_mutebtb_invers_base.png',
      spritesheet: 'gui.buttons',
      onClick: () => {
        game.sound.volume = 1;
        muteAudioButton.visible = true;
        unmuteAudioButton.visible = false;
      },
    });
    unmuteAudioButton.visible = false;
    this.add(unmuteAudioButton);
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

export default AudioToggle;
