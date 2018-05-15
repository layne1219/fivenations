/* global Phaser, window */
import { ENTITY_ICON_CONSTRUCT } from '../common/Const';
import ProductionTabButton, { SPRITESHEET_ID } from './ProductionTabButton';

const ns = window.fivenations;

// Number of slots to be shown in the Production Tab
const SLOTS_COUNT = 9;

// Paddings between Slot elements
const SLOTS_PADDING_X = 5;
const SLOTS_PADDING_Y = 5;

// Status Bar
const STATUS_BAR_COLOR = '0x84e1e3';
const STATUS_BAR_PADDING = 2;
const STATUS_BAR_X = 43;
const STATUS_BAR_Y = 10;
const STATUS_BAR_WIDTH = 300;
const STATUS_BAR_HEIGHT = 15;

// Rainbow table for the dynamically generated ProductionTabButton
// spritesheet. The table associates the indices with frame names
export const PRODUCTION_ICON_FRAMES = {};

/**
 * Phaser.Group class that realises the Production Slot element
 */
class ProductionTab extends Phaser.Group {
  constructor(game) {
    super(game);
    this.createProductionTabButtonSpriteSheet();
    this.addButtons();
    this.addStatusBar();
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
        this.buttons[i].frame = PRODUCTION_ICON_FRAMES[slots[i].id];
        if (i === 0) {
          this.updateStatusBar(slots[0]);
        }
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
        const space = button.width + SLOTS_PADDING_X;
        button.x = (i - 1) * space;
        button.y = button.height + SLOTS_PADDING_Y;
      }

      button.setSlotIdx(i);

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
    for (let i = 1; i <= SLOTS_COUNT; i += 1) {
      const sprite = this.createElement({
        assetId: 'gui',
        id: `XXX_gui_construction_queue_${i}.png`,
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
      PRODUCTION_ICON_FRAMES[key] = idx;
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

  /**
   * Adds the status bar to the prodution tab
   */
  addStatusBar() {
    this.statusBar = this.game.add.graphics(0, 0);
    this.add(this.statusBar);
  }

  /**
   * Redraws the status bar according to the remaining time of the
   * executed production
   * @param {object} currentSlot - informations about the production
   * element that is currently being produced
   */
  updateStatusBar(currentSlot) {
    const now = ns.game.game.time.time;
    const { complitionTime, time } = currentSlot;
    const ratio = 1 - (Math.max(complitionTime, now) - now) / time;
    this.statusBar.clear();
    this.statusBar.lineStyle(1, STATUS_BAR_COLOR, 1);
    this.statusBar.drawRect(
      STATUS_BAR_X,
      STATUS_BAR_Y,
      STATUS_BAR_WIDTH,
      STATUS_BAR_HEIGHT,
    );
    this.statusBar.beginFill(STATUS_BAR_COLOR);
    this.statusBar.drawRect(
      STATUS_BAR_X + STATUS_BAR_PADDING,
      STATUS_BAR_Y + STATUS_BAR_PADDING,
      STATUS_BAR_WIDTH * ratio - STATUS_BAR_PADDING * 2,
      STATUS_BAR_HEIGHT - STATUS_BAR_PADDING * 2,
    );
    this.statusBar.endFill();
  }
}

export default ProductionTab;
