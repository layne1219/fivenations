import ControlGroup from './ControlGroup';
import EntityManager from '../../entities/EntityManager';

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
    return this.groups[idx].getEntities().forEach(entity => entity.select());
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
      userKeyboard.on(
        `key/${i}`,
        this.onControlGroupKeyPressed.bind(this, userKeyboard, i),
      );
    }
  }

  /**
   * Callback executed when one of the control group keys are pressed
   * @param {number} idx
   */
  onControlGroupKeyPressed(userKeyboard, idx) {
    if (userKeyboard.isDown(Phaser.KeyCode.CONTROL)) {
      this.save(idx);
    } else {
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
