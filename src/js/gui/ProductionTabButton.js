/* global Phaser */

// ProductionTab Icon Spritesheet cache id
export const SPRITESHEET_ID = 'production-tab-button';

/**
 * Phaser.Group class that realises the MainMenu header
 */
class ProductionTabButton extends Phaser.Group {
  constructor(game) {
    super(game);
    this.createSprite();
  }

  /**
   * Creates a Phaser.Sprite instance based on the given configuration
   * @param {object} config - { x, y, id }
   * @return {object} Phaser.Sprite
   */
  createSprite() {
    const sprite = this.game.add.sprite(0, 0, 'production-tab-button');
    this.add(sprite);
    return sprite;
  }
}

export default Header;
