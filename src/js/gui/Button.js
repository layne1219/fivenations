/* global window, Phaser */
import { GUI_BUTTON } from '../common/Const';

const ns = window.fivenations;

/**
 * Realises a basic Button that inherits from Phaser.Group
 */
class Button extends Phaser.Group {
  /**
   * @param {object} config - Configuration object
   */
  constructor(config) {
    super(ns.game.game);
    this.initComponents(config);
    this.setCoordinates(config);
    this.update(config);
  }

  /**
   * Instantiate the components
   * @param {object} config - configuration object to specify the button
   */
  initComponents(config) {
    const phaserGame = ns.game.game;
    const onClick = () => config.onClick && config.onClick.call(this);
    const over = config.customOverFrame || GUI_BUTTON.frames.over;
    const out = config.customOutFrame || GUI_BUTTON.frames.out;
    const down = config.customDownFrame || GUI_BUTTON.frames.down;
    const spritesheet = config.spritesheet || GUI_BUTTON.spritesheet.id;

    this.sprite = phaserGame.add.button(
      0,
      0,
      spritesheet,
      onClick,
      this,
      over,
      out,
      down,
    );
    this.sprite.anchor.set(0.5);

    if (config.fixedToCamera) {
      this.fixedToCamera = true;
    }

    this.text = phaserGame.add.text(0, 0, '', {
      ...GUI_BUTTON.style,
      wordWrapWidth: this.sprite.width,
    });
    this.text.anchor.set(0.5);

    this.add(this.sprite);
    this.add(this.text);
  }

  setCoordinates({ x, y, fixedToCamera }) {
    const cX = x || ns.window.width / 2;
    const cY = y || ns.window.height / 2;
    this.x = cX;
    this.y = cY;
    if (fixedToCamera) {
      this.fixedToCamera = true;
      this.cameraOffset.setTo(cX, cY);
    }
  }

  /**
   * Updates the button instance according to the passed configuration object
   * @param {object config - specify the updates
   */
  update(config) {
    if (!config) return;
    if (config.text) this.text = config.text;
  }
}

export default Button;
