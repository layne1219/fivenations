/* global Phaser */

// ProductionTab Icon Spritesheet cache id
export const SPRITESHEET_ID = 'production-tab-button';

/**
 * Phaser.Group class that realises the MainMenu header
 */
class ProductionTabButton extends Phaser.Sprite {
  constructor(game) {
    super(game, 0, 0, SPRITESHEET_ID);
    this.game.add.existing(this);
    this.inputEnabled = true;
  }
}

export default ProductionTabButton;
