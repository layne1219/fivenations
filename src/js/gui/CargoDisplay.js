/* global Phaser */
import { DEFAULT_FONT } from '../common/Const';

/**
 * Phaser.Group class that realises the Cargo Display
 */
class CargoDisplay extends Phaser.Group {
  constructor(game, iconFrame, color) {
    super(game);

    this.addIcon(iconFrame);
    this.addText(color);
  }

  /**
   * Adds the icon element
   * @param {string} iconFrame - frameName for Phaser.Frame
   */
  addIcon(iconFrame) {
    this.icon = this.game.add.sprite(0, 0, 'gui');
    this.icon.frameName = iconFrame;
    this.add(this.icon);
  }

  /**
   * Adds the text element
   * @param {string} color - Color string
   */
  addText(color) {
    this.label = this.game.add.text(this.icon.x + this.icon.width, 0, '', {
      font: DEFAULT_FONT.font,
      fill: color,
    });
    this.add(this.label);
  }

  /**
   * Updates the display with the given number
   * @param {number} amount
   */
  update(amount) {
    this.label.text = amount;
  }
}

export default CargoDisplay;
