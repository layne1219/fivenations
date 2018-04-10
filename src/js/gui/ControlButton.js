/* global window, Phaser */
import ControlButtonCollection from './ControlButtonCollection';
import TranslationManager from '../common/TranslationManager';
import { Tooltipify } from './Tooltip';

const PADDING_ONCLICK = 2;
const TRANSPARENCY_ONLICK = 0.75;

// reference to the shared game configuarition object
const ns = window.fivenations;

class ControlButton extends Phaser.Sprite {
  /**
   * Returns an a ControlPanelPage that consists the clickable command buttons
   * @return {object} [ControlPanelPage]
   */
  constructor(entityManager) {
    super(entityManager.getGame(), 0, 0, 'gui');

    // initialising the buttons
    this.init(entityManager);

    // applying default event handlers on the generated instance
    this.addEventListeners();

    // activating custom behaviour upon click
    this.addBehaviour();

    // Attach Tooltip to the button
    this.addTooltip();
  }

  /**
   * Adds the Sprite object to the Game stage
   */
  init(entityManager) {
    this.game.add.existing(this);
    this.inputEnabled = true;
    this.entityManager = entityManager;
  }

  /**
   * Adds all the default event listeners
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
   * Adds event listeners to the ControlButton
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
   * Attaches a Tooltip instance to the button
   */
  addTooltip() {
    Tooltipify({
      target: this,
      label: () => this.tooltipLabel,
    });
  }

  /**
   * Executes the logic corresponding to the control button being clicked
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
   * Sets or occasionally resets the frame, activity callback and
   * tooltip label accoding to the given id
   * @param {number} id
   */
  setId(id) {
    this.id = id;
    this.setButtonFrame(id);
    this.setTranslatedTooltipLabel(id);
    return this;
  }

  /**
   * Sets the attached sprite's frame to the given id
   * @param {number} id
   */
  setButtonFrame(id) {
    this.frame = id;
  }

  /**
   * Determines the translation for the Tooltip
   * @param {number} id
   */
  setTranslatedTooltipLabel(id) {
    const translationLabel = ControlButtonCollection.getTranslationKeyById(id);
    this.tooltipLabel = TranslationManager.getInstance().translate(translationLabel);
  }

  /**
   * Set the coordinates of the sprite instance
   * @param {number} x [horizontal padding on the control page]
   * @param {number} y [vertical padding on the control page]
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
