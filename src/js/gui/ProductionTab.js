/* global Phaser, window */
import { ENTITY_ICON_CONSTRUCT } from '../common/Const';
import ProductionTabButton, { SPRITESHEET_ID } from './ProductionTabButton';

const ns = window.fivenations;

// Number of slots to be shown in the Production Tab
const SLOTS_COUNT = 10;

// Paddings between Slot elements
const SLOTS_PADDING_X = 5;
const SLOTS_PADDING_Y = 5;

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
   * Updates the Production tab based on the production queue
   * of the given entity
   * @param {object} entity - Entity instance
   */
  updateContent(entity) {
    const slots = entity.getProductionManager().getAllSlots();
    for (let i = 0; i < SLOTS_COUNT; i += 1) {
      if (slots[i]) {
        this.buttons[i].frame = frames[slots[i]];
      } else {
        this.buttons[i].frame = i;
      }
    }
  }

  /**
   * Add all production slot buttons
   */
  addButtons() {
    this.buttons = [];
    for (let i = 0; i < SLOTS_COUNT; i += 1) {
      const button = new ProductionTabButton(this.game);

      if (i === 0) {
        button.x = 0;
        button.y = 0;
      } else {
        button.x = (i - 1) * (button.width + SLOTS_PADDING_X);
        button.y = button.height + SLOTS_PADDING_Y;
      }

      this.buttons.push(button);
      this.add(button);
    }
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
    for (let i = 0; i < SLOTS_COUNT - 1; i += 1) {
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
    const bmd = this.game.add.bitmapData(width, height);

    Object.keys(sprites).forEach((key, idx) => {
      const sprite = sprites[key];
      const x = spriteWidth * (idx % columns);
      const y = spriteHeight * Math.floor(idx / columns);
      bmd.drawSprite(sprite, x, y);
      frames[key] = idx;
    });

    this.game.cache.addSpriteSheet(
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

  /**
   * Creates a Phaser.Sprite instance based on the given configuration
   * @param {object} config - { x, y, id }
   * @return {object} Phaser.Sprite
   */
  createElement(config) {
    const {
      x, y, id, idx, assetId,
    } = config;
    const sprite = this.game.add.sprite(x || 0, y || 0, assetId);
    if (id) {
      sprite.frameName = id;
    } else if (idx) {
      sprite.frame = idx;
    }
    return sprite;
  }
}

export default ProductionTab;
