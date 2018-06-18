/* global Phaser, window */
import HangarDisplaySlot from './HangarDisplaySlot';

const ns = window.fivenations;

// icon dimensions
const SLOT_MARGIN = 25;

/**
 * Phaser.Group class that realises the Cargo Display
 */
class HangarDisplay extends Phaser.Group {
  constructor(entity) {
    super(ns.game.game);
    this.entity = entity;

    this.createSlots(entity);
  }

  /**
   * Creates the layout for each slot
   * @param {object} entity - Entity instance
   */
  createSlots(entity) {
    const hangar = entity.getDataObject().getMaxHangar();
    this.slots = [];
    for (let i = hangar - 1; i >= 0; i -= 1) {
      this.addSlot();
    }
  }

  /**
   * Adds a HangarDisplaySlot element to the collection
   */
  addSlot() {
    const slot = new HangarDisplaySlot();
    slot.y += this.slots.length * SLOT_MARGIN;
    this.slots.push(slot);
    this.add(slot);
  }

  /**
   * Returns an array of objects representing each type of the entities
   * inside of the hanger and a number of them { entity, count }
   * @return {object} array of Entity instances
   */
  getEntityGroups() {
    const entities = this.entity.getDockedEntities();
    if (!entities || !entities.length) return [];
    return entities.reduce((data, entity) => {
      const id = entity.getDataObject().getId();
      if (!data[id]) data[id] = [];
      data[id].push(entity);
      return data;
    }, {});
  }

  /**
   * Updates the display with the given number
   */
  update() {
    const groups = this.getEntityGroups();
    const keys = Object.keys(groups);
    for (let i = 0, l = this.slots.length; i < l; i += 1) {
      if (groups[keys[i]]) {
        const entity = groups[keys[i]][0];
        const count = groups[keys[i]].length;
        this.slots[i].show();
        this.slots[i].update(entity, count);
      } else {
        this.slots[i].hide();
      }
    }
  }
}

export default HangarDisplay;
