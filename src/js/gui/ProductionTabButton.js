/* global Phaser */
import EventEmitter from '../sync/EventEmitter';

// ProductionTab Icon Spritesheet cache id
export const SPRITESHEET_ID = 'production-tab-button';

/**
 * Phaser.Group class that realises the MainMenu header
 */
class ProductionTabButton extends Phaser.Sprite {
  /**
   * @param {object} game - Phaser.Game instance
   */
  constructor(game) {
    super(game, 0, 0, SPRITESHEET_ID);
    this.game.add.existing(this);
    this.inputEnabled = true;
    this.initEventListeners();
  }

  /**
   * Initialises callbacks against onClick event
   */
  initEventListeners() {
    this.events.onInputUp.add(this.onClick.bind(this));
  }

  /**
   * executed when clicking on the button
   */
  onClick() {
    EventEmitter.getInstance()
      .synced.entities(':user:selected')
      .cancelProduction(this.slotIdx);
  }

  /**
   * Sets the corresponding Slot index so that we know which
   * production element this button represents in the queue
   * @param {number} slotIdx - ProductionTab Slot index
   */
  setSlotIdx(slotIdx) {
    this.slotIdx = slotIdx;
  }
}

export default ProductionTabButton;
