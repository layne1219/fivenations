/* global window, Phaser */
import ControlButtonCollection from './ControlButtonCollection';
import TranslationManager from '../common/TranslationManager';
import { PRODUCTION_ICON_FRAMES } from './ProductionTab';
import { SPRITESHEET_ID as entityIcons } from './ProductionTabButton';
import { Tooltipify } from './Tooltip';

const abilitiesJSON = require('../../assets/datas/common/abilities.json');

const PADDING_ONCLICK = 2;
const TRANSPARENCY_ONLICK = 0.75;

// empty icon id
// this is used to place additional labels on the buttons
// such as entity icons for the produce ability
const EMPTY_ICON_NAME = 'gui_btn_50_spc.png';

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
      buttonLogic.activate(this.entityManager, controlPanel, this);
    }
    return this;
  }

  /**
   * Executes the logic attached to the deactive event
   */
  deactivate() {
    const buttonLogic = ControlButtonCollection.getLogicByControlButton(this);
    const controlPage = this.getControlPage();
    const controlPanel = controlPage.getControlPanel();
    if (typeof buttonLogic.deactivate === 'function') {
      buttonLogic.deactivate(this.entityManager, controlPanel, this);
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
    if (this.entityIconsSprite) {
      this.entityIconsSprite.visible = false;
    }
    return this;
  }

  /**
   * Sets the attached sprite's frame to the given id
   * @param {number} id
   */
  setButtonFrame(id) {
    this.frame = abilitiesJSON[id];
  }

  /**
   * Adds label on the top of the button according to the
   * original id that equals to an Entity Id
   * @param {object} entityId - Entity instance to be produced
   */
  convertToProduceButton(entityId) {
    this.setEntityIconAsLabel(entityId);
    this.setProducableEntity(entityId);
  }

  /**
   * Shows the given entity's icon as the label on the top of the
   * button
   * @param {string} entityId - id of the given entity
   */
  setEntityIconAsLabel(entityId) {
    if (!this.entityIconsSprite) {
      this.entityIconsSprite = this.game.add.sprite(5, 6, entityIcons);
      this.addChild(this.entityIconsSprite);
    }

    // turns the original button to an empty button
    const buttonId = 'produce';
    this.id = buttonId;
    this.frameName = EMPTY_ICON_NAME;

    // makes the entity icon visible
    this.entityIconsSprite.frame = PRODUCTION_ICON_FRAMES[entityId];
    this.entityIconsSprite.visible = true;

    // updates the tooltip to the entity's name
    this.setTranslatedTooltipLabel(entityId);
  }

  /**
   * Shows the given entity's icon as the label on the top of the
   * button
   * @param {string} entityId - id of the given entity
   */
  setProducableEntity(entityId) {
    this.producableEntityId = entityId;
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
   * Transforms the button to a cancel button
   */
  convertToCancelProductionButton() {
    this.setId('cancelProduction');
    this.visible = true;
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

  /**
   * Returns the id of the entity can be produced by clicking on this button
   * @return {string}
   */
  getProducableEntity() {
    return this.producableEntityId;
  }
}

export default ControlButton;
