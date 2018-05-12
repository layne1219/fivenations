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

      // according to the layout the first two slots must be
      // below one another and the rest spread out horizontally
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
    this.addSlotIcons(sprites);
    this.addEntityIcons(sprites);
    this.constructSpriteSheet(sprites);
  }

  /**
   * Creates sprites for the production slot icons to the
   * and appends them to given sprite collection
   * @param {object} sprites
   */
  addSlotIcons(sprites) {
    const slotNamePrefix = 'slot-';
    for (let i = 0; i < SLOTS_COUNT - 1; i += 1) {
      const sprite = this.createElement({
        assetId: 'gui',
        id: `XXX_gui_construction_queue_${i + 1}.png`,
      });
      sprites[`${slotNamePrefix}${i}`] = sprite;
    }
  }

  /**
   * Creates sprites for all the entity icons and appends them to
   * given sprite collection
   * @param {object} sprites
   */
  addEntityIcons(sprites) {
    Object.keys(ns.entities)
      .filter((key) => {
        const data = this.game.cache.getJSON(key);
        return data.type !== 'Space Object';
      })
      .forEach((key) => {
        const sprite = this.createElement({
          assetId: key,
          idx: ENTITY_ICON_CONSTRUCT,
        });
        sprites[key] = sprite;
      });
  }

  /**
   * Pieces all the given sprites together into spritesheet. This is
   * because the icons of entities are placed into separate spritesheets and
   * in order to keep the rendering of the production tab efficient we
   * merge them together into one spritesheet.
   * @param {object} sprites - collection of Phaser.Sprites
   */
  constructSpriteSheet(sprites) {
    const spriteCount = Object.keys(sprites).length;
    const columns = 25;
    const firstKey = Object.keys(sprites)[0];
    const spriteWidth = sprites[firstKey].width;
    const spriteHeight = sprites[firstKey].height;
    const rows = Math.floor(spriteCount / columns);
    const width = Math.floor(spriteWidth * columns);
    const height = Math.floor(spriteHeight * rows);
    const bmd = this.game.add.bitmapData(width, height);

    Object.keys(sprites).forEach((key, idx) => {
      const sprite = sprites[key];
      const x = spriteWidth * (idx % columns);
      const y = spriteHeight * Math.floor(idx / columns);
      bmd.draw(sprite, x, y);
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
    const sprite = this.game.make.sprite(x || 0, y || 0, assetId);
    if (id) {
      sprite.frameName = id;
    } else if (idx) {
      sprite.frame = idx;
    }
    return sprite;
  }
}

export default ProductionTab;
