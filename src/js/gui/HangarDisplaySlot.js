/* global Phaser, window */
/* eslint no-underscore-dangle: 0 */
import { ENTITY_ICON, ENTITY_ICON_DIMENSIONS } from '../common/Const';

const ns = window.fivenations;
// icon dimensions
const ICON_WIDTH = 30;

const ICON_RATIO_X = ICON_WIDTH / ENTITY_ICON_DIMENSIONS.width;

// font family and size
const FONT = '14px BerlinSansFB-Reg';

class HangarDisplaySlot extends Phaser.Group {
  constructor() {
    super(ns.game.game);
    this.createIcon();
    this.createText();
  }

  /**
   * Adds the icon element
   * @return {object} BitampData
   */
  createIcon() {
    this.bmd = this.game.add.bitmapData(
      ENTITY_ICON_DIMENSIONS.width,
      ENTITY_ICON_DIMENSIONS.height,
    );
    this.icon = this.bmd.addToWorld(0, 0);
    this.icon.anchor.set(0.5);
    this.icon.scale.set(ICON_RATIO_X);
    this.add(this.icon);
  }

  /**
   * Adds the text element
   * @return {object} Phaser.Text
   */
  createText() {
    const x = ICON_WIDTH;
    this.text = this.game.add.text(x, this.icon.y, '', {
      font: FONT,
      fill: '#ffffff',
    });
    this.text.anchor.set(0.5);
    this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.add(this.text);
  }

  /**
   * Draws the icon of the given entity to the BitmapData
   * @param {object} entity - Entity istance
   */
  updateIcon(entity) {
    const sprite = entity.getSprite();
    if (this._sprite === sprite) return;
    this._sprite = sprite;

    const oldFrame = sprite.frame;
    sprite.frame = ENTITY_ICON;
    sprite.anchor.setTo(0, 0);
    this.bmd.clear();
    this.bmd.draw(sprite, 0, 0);
    sprite.anchor.setTo(0.5, 0.5);
    sprite.frame = oldFrame;
  }

  /**
   * Updates the counter to the given number
   * @param {number} count
   */
  updateText(count) {
    this.text.text = count;
  }

  /**
   * Updates the display with the given number
   * @param {object} entity - Entity istance
   * @param {number} count
   */
  update(entity, count) {
    if (!entity) return;
    this.updateIcon(entity);
    this.updateText(count);
  }

  /**
   * Makes the group visible
   */
  show() {
    this.visible = true;
  }

  /**
   * Makes the group invisible
   */
  hide() {
    this.visible = false;
  }
}

export default HangarDisplaySlot;
