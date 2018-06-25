import ControlGroup from './ControlGroup';
import EntityManager from '../../entities/EntityManager';
import UserKeyboard from '../UserKeyboard';

let singleton;

const CONTROL_GROUP_COUNT = 10;

class ControlGroupManager {
  constructor() {
    this.groups = [];
    for (let i = CONTROL_GROUP_COUNT - 1; i >= 0; i--) {
      this.groups.push(new ControlGroup());
    }
  }

  /**
   * Returns the Control Group instance by the given index
   * @param {number} idx
   * @return {object} instance of ControlGroup
   */
  select(idx) {
    const entities = this.groups[idx].getEntities();
    if (!entities || !entities.length) return;
    this.currentGroupIdx = idx;
    return entities.forEach(entity => entity.select());
  }

  /**
   * Unselects the current control group
   */
  unselectAll() {
    EntityManager.getInstance().unselectAll();
  }

  /**
   * Saves the selected entities to the ControlGroup with the given index
   * @param {number} idx
   */
  save(idx) {
    const entities = EntityManager.getInstance().entities(':selected');
    this.groups[idx].set(entities);
  }

  /**
   * Registers the event listeners
   * @param {object} userKeyboard - instance of UserKeyboard
   */
  addKeyboardListeners(userKeyboard) {
    for (let i = CONTROL_GROUP_COUNT - 1; i >= 0; i -= 1) {
      userKeyboard.on(`key/${i}`, this.onControlGroupKeyPressed.bind(this, i));
    }
  }

  /**
   * Callback executed when one of the control group keys are pressed
   * @param {number} idx
   */
  onControlGroupKeyPressed(idx) {
    const userKeyboard = UserKeyboard.getInstance();
    if (userKeyboard.isDown(Phaser.KeyCode.CONTROL)) {
      this.save(idx);
    } else {
      if (!userKeyboard.isDown(Phaser.KeyCode.SHIFT)) {
        this.unselectAll();
      }
      this.select(idx);
    }
  }
}

export default {
  /**
   * returns singleton instance of the manager object
   * @return {object} Singleton instance of EntityManager
   */
  getInstance() {
    if (!singleton) {
      singleton = new ControlGroupManager();
    }
    return singleton;
  },
};
