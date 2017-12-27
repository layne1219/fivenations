/* global window, Phaser */
import ControlButtonCollection from './ControlButtonCollection';

const PADDING_ONCLICK = 2;
const TRANSPARENCY_ONLICK = 0.75;

// reference to the shared game configuarition object
const ns = window.fivenations;

class ControlButton extends Phaser.Sprite {
  /**
   * Constructing an a ControlPanelPage that consists the clickable command buttons
   * @return {object} [ControlPanelPage]
   */
  constructor(entityManager) {
    super(ns.game, 0, 0, 'gui');

    // initialising the buttons
    this.init(entityManager);

    // applying default event handlers on the generated instance
    this.addEventListeners();

    // activating custom behaviour upon click
    this.addBehaviour();
  }

  /**
   * Adding the Sprite object to the Game stage
   * @return {void}
   */
  init(entityManager) {
    ns.game.add.existing(this);
    this.inputEnabled = true;
    this.entityManager = entityManager;
  }

  /**
   * Adding all the default event listeners
   * @return {[void]}
   */
  addEventListeners() {
    this.events.onInputDown.add(() => {
      this.y += PADDING_ONCLICK;
      this.alpha = TRANSPARENCY_ONLICK;
    });
    this.events.onInputUp.add(() => {
      this.y -= PADDING_ONCLICK;
      this.alpha = 1;
    });
  }

  /**
   * Add event listeners to the ControlButton
   * @param {[type]} button [description]
   */
  addBehaviour() {
    this.events.onInputUp.add(() => {
      this.activate();
      if (ns.gui.selectedControlButton) {
        ns.gui.selectedControlButton.deactivate();
      }
      ns.gui.selectedControlButton = this;
    });
  }

  /**
   * Execute the logic corresponding to the control button being clicked
   * @return {[void]}
   */
  activate() {
    const buttonLogic = ControlButtonCollection.getLogicByControlButton(this);
    // reference to ControlPanel needs to be evaluated in run time
    const controlPage = this.getControlPage();
    const controlPanel = controlPage.getControlPanel();
    if (typeof buttonLogic.activate === 'function') {
      buttonLogic.activate(this.entityManager, controlPanel);
    }
    return this;
  }

  /**
   * No-op function for inheritance
   * @return {[void]}
   */
  deactivate() {
    const buttonLogic = ControlButtonCollection.getLogicByControlButton(this);
    const controlPage = this.getControlPage();
    const controlPanel = controlPage.getControlPanel();
    if (typeof buttonLogic.deactivate === 'function') {
      buttonLogic.deactivate(this.entityManager, controlPanel);
    }
    return this;
  }

  /**
   * Setting the ID of the button which determines what the click callback will do
   * @return {void}
   */
  setId(id) {
    this.frame = id;
    this.id = id;
    return this;
  }

  /**
   * Set the coordinates of the sprite instance
   * @param {[type]} x [horizontal padding on the control page]
   * @param {[type]} y [vertical padding on the control page]
   */
  setCoords(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Obtaining the Id the button is set up to
   * @return {[Integer]} Ability Identifier the button represent
   */
  getId() {
    return this.id;
  }

  /**
   * return the control page which takes in the target control button
   * we need this reference to switch between pages from the button logic's scope
   * @return {[object]} [GUI.ControlPage]
   */
  getControlPage() {
    return this.parent;
  }
}

export default ControlButton;
