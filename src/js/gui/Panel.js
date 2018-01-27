/* global window, Phaser */
import UserPointer from './UserPointer';
const SPRITE_KEY = 'gui';
const SPRITE_FRAME = 64;
const PANEL_HEIGHT = 222;
const ns = window.fivenations;

export default class Panel extends Phaser.Image {
  constructor(phaserGame) {
    const x = 0;
    const y = ns.window.height - PANEL_HEIGHT;
    super(phaserGame, x, y, SPRITE_KEY, SPRITE_FRAME);

    this.initDefaultAttributes();
  }

  /**
   * Initialises the default attributes of the panel Image object
   */
  initDefaultAttributes() {
    this.fixedToCamera = true;
  }

  /**
   * Attach the Panel object to the a random Phaser.Game element
   * @param {object} panel Main GUI Group
   * @return {void}
   */
  appendTo(parent) {
    if (!parent) {
      throw new Error('Invalid Phaser element object!');
    }
    parent.add(this);
  }

  /**
   * Returns whether the user pointer is currently hovering the panel
   * @return {boolean}
   */
  isHover() {
    // simplified solution to save CPU time
    const mouseY = UserPointer.getInstance().getScreenCoords().y;
    return mouseY >= ns.window.height - PANEL_HEIGHT;
  }
}
