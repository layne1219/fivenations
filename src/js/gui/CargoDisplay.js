/* global Phaser */

// font family and size
const FONT = '14px BerlinSansFB-Reg';

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
    const x = this.icon.x + this.icon.width;
    const y = this.icon.y + 4;
    this.label = this.game.add.text(x, y, '', {
      font: FONT,
      fill: color,
    });
    this.label.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
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
