/* global Phaser, window */
import ControlButton from './ControlButton';

const ns = window.fivenations;

// layout details
const COLUMNS = 5;
const ROWS = 5;
const ICON_WIDTH = 40;
const ICON_HEIGHT = 40;
const MARGIN = 0;
const BUTTON_COUNT = ROWS * COLUMNS;

// fixed layout positions for abilities if a given ability
// does not incorporated into this object literal it will be
// placed automatically at the next available slot.
const ABILITY_POSITIONS = {
  cancelProduction: BUTTON_COUNT - 1,
};

/**
 * Returns true if there is only one entity in the given array
 * @param {object} entities - Array of Entity instances
 * @return {boolean}
 */
function hasOnlyOneEntity(entities) {
  return entities.length === 1;
}

/**
 * Extends the merged abilities with complementory abilities
 * that must be tested on the fly
 * @param {object} abilities - Array of ability IDs
 * @param {object} entities - Array of Entity instances
 */
function extendAbilities(abilities, entities) {
  // if there is only one entity selected
  if (entities.length === 1) {
    // if the selected entity is producing other entities
    // we must display the cancel production button
    if (entities[0].isProducing()) {
      abilities.push('cancelProduction');
    }
  }
}

/**
 * Returns if the given ability requires a Produce Button
 * @param {string} ability - Id of the ability
 * @return {boolean}
 */
function shouldControlButtonBeAProduceButton(ability) {
  return Object.keys(ns.entities).some(id => ability === id);
}

class ControlPanelPage extends Phaser.Group {
  /**
   * Constructing an a ControlPanelPage that consists the clickable
   * command buttons
   * @param {object} entityManager
   * @return {object} ControlPanelPage
   */
  constructor(entityManager) {
    super(entityManager.getGame());

    // initialising the buttons
    this.init(entityManager);
  }

  /**
   * Setting up the table of command buttons
   * @return {void}
   */
  init(entityManager) {
    this.buttons = [];
    this.entityManager = entityManager;

    this.populate();
  }

  /**
   * Createing the ControlButtons and moving them to their right position
   * @return {[void]}
   */
  populate() {
    let button;
    for (let i = 0; i < BUTTON_COUNT; i += 1) {
      const x = (i % COLUMNS) * (ICON_WIDTH + MARGIN);
      const y = Math.floor(i / COLUMNS) * (ICON_HEIGHT + MARGIN);

      button = this.createControlButton();
      button.setCoords(x, y);

      this.addControlButton(button);
    }
  }

  /**
   * returns a fresh instance of ControlButton
   * @param  {string} id - Id of the button
   * @return {object} GUI.ControlButton
   */
  createControlButton(id) {
    const button = new ControlButton(this.entityManager);
    if (id) {
      button.setId(id);
    }
    return button;
  }

  /**
   * Add ControlButton to the container
   * @param {[object]} GUI.ControlButton [attaching the ControlButton to the Phaser group layer]
   * @param {[void]}
   */
  addControlButton(controlButton) {
    if (!controlButton) {
      throw new Error('Invalid ControlButton instance was passed as the first parameter!');
    }
    this.buttons.push(this.add(controlButton));
  }

  /**
   * Updating the page according to the currently selected collection of entities
   * @param  {[Array]} entities [Array of Entity instances]
   * @return {[void]}
   */
  update(entities) {
    if (!entities) {
      return;
    }
    const abilities = this.parent.entityManager.getMergedAbilities(entities);
    extendAbilities(abilities, entities);

    this.resetAllButtons();
    this.showButtonsByAbilities(abilities, entities);
  }

  /**
   * Sets all button back to the initial state
   */
  resetAllButtons() {
    this.buttons.forEach((button) => {
      button.visible = false;
      button.enable();
    });
  }

  /**
   * Shows the control buttons according to the given ability IDs
   * @param {object} abilities - Array of ability IDs
   * @param {object} entities - Array of Entity instances
   */
  showButtonsByAbilities(abilities, entities) {
    abilities.forEach((ability, idx) => {
      const buttonIdx = ABILITY_POSITIONS[ability] || idx;
      const button = this.buttons[buttonIdx];
      if (!button) return;
      // if the ability equals to the name of an entity
      // the button must be converted into a produce button
      if (shouldControlButtonBeAProduceButton(ability)) {
        if (hasOnlyOneEntity(entities)) {
          const entity = entities[0];
          button.convertToProduceButton(ability, entity);
          button.visible = true;
        }
      } else {
        button.setId(ability);
        button.visible = true;
      }
    });
  }

  /**
   * return the control panel which incorporates all the available control pages
   * we need this reference to switch between pages from the button logic's scope
   * @return {[object]} [GUI.ControlPanel]
   */
  getControlPanel() {
    return this.parent;
  }
}

export default ControlPanelPage;
