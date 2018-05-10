/* global Phaser, window */
import { ENTITY_ICON_CONSTRUCT } from '../common/Const';
import ProductionTabButton, { SPRITESHEET_ID } from './ProductionTabButton';

const ns = window.fivenations;

// Number of slots to be shown in the Production Tab
const SLOTS_COUNT = 10;

// Rainbow table for the dynamically generated ProductionTabButton
// spritesheet. The table associates the indices with frame names
const frames = {};

/**
 * Phaser.Group class that realises the Production Slot element
 */
class ProductionTab extends Phaser.Group {
  constructor(game) {
    super(game);
    this.createProductionTabButtonSpriteSheet();
    this.addButtons();
  }

  /**
   * Add all production slot buttons
   */
  addButtons() {
    this.buttons = [];
  }

  /**
   * Adds a Button
   * @param {object} config - { x, y, label, onClick }
   * @return {object} HeaderButton instance
   */
  addButton(config) {
    const { x, y, onClick } = config;
    const idx = this.buttons.length || 0;
    const count = idx + 1;
    const button = this.createElement({
      id: `XXX_gui_construction_queue_${count}.png`,
    });
    this.add(button);
    this.buttons.push(button);
    return button;
  }

  /**
   * Creates a Phaser.Sprite instance based on the given configuration
   * @param {object} config - { x, y, id }
   * @return {object} Phaser.Sprite
   */
  createElement(config) {
    const {
      x, y, id, idx,
    } = config;
    const sprite = this.game.add.sprite(x || 0, y || 0, assetId);
    if (id) {
      sprite.frameName = id;
    } else if (idx) {
      sprite.frame = idx;
    }
    return sprite;
  }

  /**
   * Dynamically constructs the dedicated spritesheet for the
   * production tab buttons
   */
  createProductionTabButtonSpriteSheet() {
    const sprites = {};
    let spriteCount = 0;

    // add slot frames
    const slotNamePrefix = 'slot-';
    for (let i = SLOTS_COUNT - 1; i >= 0; i--) {
      const sprite = this.createElement({
        assetId: 'gui',
        id: `XXX_gui_construction_queue_${i + 1}.png`,
      });
      sprites[`${slotNamePrefix}${i}`] = sprite;
      spriteCount += 1;
    }

    // add entity icons
    Object.keys(ns.entities).forEach((key) => {
      const sprite = this.createElement({
        assetId: key,
        idx: ENTITY_ICON_CONSTRUCT,
      });
      sprites[key] = sprite;
      spriteCount += 1;
    });

    const columns = 25;
    const spriteWidth = sprites[0].width;
    const spriteHeight = sprites[0].height;
    const rows = Math.floor(spriteCount / columns);
    const width = Math.floor(spriteWidth * columns);
    const height = Math.floor(spriteHeight * rows);
    const bmd = game.add.bitmapData(width, height);

    Object.keys(sprites).forEach((key, idx) => {
      const sprite = sprites[key];
      const x = spriteWidth * (idx % columns);
      const y = spriteHeight * Math.floor(idx / columns);
      bmd.drawSprite(sprite, x, y);
      frames[key] = idx;
    });

    game.cache.addSpriteSheet(
      SPRITESHEET_ID,
      '',
      bmd.canvas,
      spriteWidth,
      spriteHeight,
      spriteCount,
      0,
      0,
    );
  }
}

export default ProductionTab;
