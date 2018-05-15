/* global Phaser, window */
import ControlButton from './ControlButton';

const ns = window.fivenations;

// layout details
const COLUMNS = 5;
const ROWS = 5;
const ICON_WIDTH = 40;
const ICON_HEIGHT = 40;
const MARGIN = 0;
const BUTTON_NUMBER = ROWS * COLUMNS;

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
    for (let i = 0; i < BUTTON_NUMBER; i += 1) {
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
    this.buttons.forEach((button, idx) => {
      const ability = abilities[idx];
      if (!abilities[idx]) {
        button.visible = false;
      } else {
        // if the ability equals to the name of an entity
        // the button must be converted into a produce button
        if (Object.keys(ns.entities).some(id => ability === id)) {
          button.convertToProduceButton(ability);
        } else {
          button.setId(ability);
        }
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
