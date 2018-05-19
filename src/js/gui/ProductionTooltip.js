/* global window, Phaser */
import Graphics from '../common/Graphics';
import TranslationManager from '../common/TranslationManager';
import { DEFAULT_FONT, GROUP_TOOLTIPS } from '../common/Const';

const ns = window.fivenations;

// font
const FONT = {
  font: DEFAULT_FONT.font,
  headerFont: '13px BerlinSansFB-Reg',
  defaultFill: DEFAULT_FONT.color,
  whiteFill: '#ffffff',
  darkFill: '#728dbc',
  redFill: '#ff0000',
};

// icons for resources
const ICON_TITANIUM = 'gui_resource_01_titanium.png';
const ICON_SILICIUM = 'gui_resource_02_silicium.png';
const ICON_URANIUM = 'gui_resource_03_uranium.png';
const ICON_ENERGY = 'gui_resource_04_energy.png';
const ICON_SUPPLY = 'gui_resource_05_place.png';

// reference for a tooltip instance that can be reused
let tooltip;

/**
 * Generic Tooltip implementation that can be used in conjuntion with
 * Tooltipify() function that automatically adds a Tooltip to an existing
 * Phaser Graphics element
 */
class ProductionTooltip extends Phaser.Group {
  /**
   * Initialise an extended Phaser.Group with the tooltip background
   * and a Text element that can be updated through the exposed API
   * @param {object} phaserGame - Phaser.Game instance
   */
  constructor(phaserGame) {
    super(phaserGame);
    this.setFixedToTheCamera();
    this.setDefaultVisiblity();
    this.initBackgroundSprite(phaserGame);
    this.initEntityLabels();
    this.createResourceGroup();
    this.createPrerequisitsGroup();
  }

  /**
   * Sets the this Phaser.Group fixed to the Camera
   */
  setFixedToTheCamera() {
    this.fixedToCamera = true;
  }

  /**
   * Sets the default visibility of the Group
   */
  setDefaultVisiblity() {
    this.visible = false;
  }

  /**
   * Adds the tooltip background sprite to the Group
   */
  initBackgroundSprite() {
    this.background = this.createSprite({ id: 'gui_descriptionpopup.png' });
  }

  /**
   * Adds all the text elements to the tooltip window
   */
  initEntityLabels() {
    // Name of the entity
    this.nameText = this.game.add.text(20, 13, '', {
      font: FONT.headerFont,
      fill: FONT.defaultFill,
    });
    // Type or category of the entity
    this.typeText = this.game.add.text(20, 26, '', {
      font: FONT.font,
      fill: FONT.whiteFill,
    });
    // Description of the entity that might be multilined
    this.descriptionText = this.game.add.text(20, 37, '', {
      font: FONT.font,
      fill: FONT.darkFill,
      wordWrap: true,
      wordWrapWidth: 161,
    });
    this.descriptionText.lineSpacing = -8;

    this.add(this.nameText);
    this.add(this.typeText);
    this.add(this.descriptionText);
  }

  /**
   * Creates all the required elements to show how much resources
   * the user requires to trigger the production of the pointed entity
   */
  createResourceGroup() {
    this.resourceGroup = this.game.add.group();
    this.titaniumIcon = this.createSprite({
      x: 15,
      y: 60,
      id: ICON_TITANIUM,
    });
    this.titaniumText = this.game.add.text(55, 75, '', {
      font: FONT.font,
      fill: FONT.whiteFill,
    });

    this.siliciumIcon = this.createSprite({
      x: 72,
      y: 60,
      id: ICON_SILICIUM,
    });
    this.siliciumText = this.game.add.text(115, 75, '', {
      font: FONT.font,
      fill: FONT.whiteFill,
    });

    this.energyIcon = this.createSprite({
      id: ICON_ENERGY,
      x: 128,
      y: 60,
    });
    this.energyText = this.game.add.text(165, 75, '', {
      font: FONT.font,
      fill: FONT.whiteFill,
    });

    this.uraniumIcon = this.createSprite({
      x: 15,
      y: 85,
      id: ICON_URANIUM,
    });
    this.uraniumText = this.game.add.text(55, 102, '', {
      font: FONT.font,
      fill: FONT.whiteFill,
    });

    this.supplyIcon = this.createSprite({
      x: 72,
      y: 85,
      id: ICON_SUPPLY,
    });
    this.supplyText = this.game.add.text(95, 102, '', {
      font: FONT.font,
      fill: FONT.whiteFill,
    });

    this.titaniumText.anchor.set(0.5);
    this.siliciumText.anchor.set(0.5);
    this.energyText.anchor.set(0.5);
    this.uraniumText.anchor.set(0.5);
    this.supplyText.anchor.set(0.5);

    this.resourceGroup.add(this.titaniumIcon);
    this.resourceGroup.add(this.siliciumIcon);
    this.resourceGroup.add(this.energyIcon);
    this.resourceGroup.add(this.uraniumIcon);
    this.resourceGroup.add(this.supplyIcon);
    this.resourceGroup.add(this.titaniumText);
    this.resourceGroup.add(this.siliciumText);
    this.resourceGroup.add(this.energyText);
    this.resourceGroup.add(this.uraniumText);
    this.resourceGroup.add(this.supplyText);

    this.add(this.resourceGroup);
  }

  /**
   * Creates the visual elements to show the list of prerequisits
   * if the attached ControlButton is disabled
   */
  createPrerequisitsGroup() {
    const translator = TranslationManager.getInstance();
    const header = translator.translate('tooltip.entities.required');
    this.prerequisitsGroup = this.game.add.group();
    this.prerequisitsHeader = this.game.add.text(20, 60, header, {
      font: FONT.font,
      fill: FONT.redFill,
    });
    this.requiredEntities = this.game.add.text(20, 73, '', {
      font: FONT.font,
      fill: FONT.redFill,
      wordWrap: true,
      wordWrapWidth: 161,
    });
    this.requiredEntities.lineSpacing = -8;

    this.prerequisitsGroup.add(this.prerequisitsHeader);
    this.prerequisitsGroup.add(this.requiredEntities);
    this.add(this.prerequisitsGroup);
  }

  /**
   * Updates the label of the Tooltip according to the given string
   * @param {object} controlButton - ControlButton instance to which
   * this tooltip is attached to
   */
  updateContent(controlButton) {
    const id = controlButton.getProducableEntity();
    const data = this.game.cache.getJSON(id);
    this.updateHeader(data);

    // the button is disabled so we show the list of prerequisits to
    // help the user undestand why the entity cannot be produced right now
    if (controlButton.isDisabled()) {
      this.prerequisitsGroup.visible = true;
      this.resourceGroup.visible = false;
      this.updatePrerequisits(data);
    } else {
      this.prerequisitsGroup.visible = false;
      this.resourceGroup.visible = true;
      this.updateProductionContent(data);
    }
  }

  /**
   * Displays the main information about the entity identified by
   * the given Id
   * @param {object} data - Entity Data object
   */
  updateHeader(dataObject) {
    const translator = TranslationManager.getInstance();
    this.nameText.text = translator.translate(`entities.${dataObject.id}`);
    this.typeText.text = translator.translate(`entities.categories.${dataObject.type.replace(/\s/g, '')}`);
    this.descriptionText.text = translator.translate(`entities.descriptions.${dataObject.id}`);
  }

  /**
   * Displays the amount of resources it requires to trigger a production of
   * the given entity
   * @param {object} data - Entity Data object
   */
  updateProductionContent(dataObject) {
    this.titaniumText.text = dataObject.titanium;
    this.siliciumText.text = dataObject.silicium;
    this.energyText.text = dataObject.energy;
    this.uraniumText.text = dataObject.uranium;
    this.supplyText.text = dataObject.space;
  }

  /**
   * Displays the list of other entities that is needed to
   * trigger the production of the given entity
   * @param {object} data - Entity Data object
   */
  updatePrerequisits(dataObject) {
    const translator = TranslationManager.getInstance();
    const entities = dataObject.requiredEntities || [];
    this.requiredEntities.text = entities
      .map(entity => translator.translate(`entities.${entity}`))
      .join('\n');
  }

  /**
   * Creates a Phaser.Sprite instance based on the given configuration
   * @param {object} config - { x, y, id }
   * @return {object} Phaser.Sprite
   */
  createSprite(config) {
    const { x, y, id } = config;
    const sprite = this.game.add.sprite(x || 0, y || 0, 'gui');
    sprite.frameName = id;
    this.add(sprite);
    return sprite;
  }
}

/**
 * Creates a Tooltip object and adds it to the Tooltip Graphics Group
 * @param {object} phaserGame - Phaser.Game object
 */
function createTooltip(phaserGame) {
  const group = Graphics.getInstance().getGroup(GROUP_TOOLTIPS);
  tooltip = new ProductionTooltip(phaserGame);
  group.add(tooltip);
  return tooltip;
}

/**
 * Attaches tooltip popup to an excisting element on a Phaser stage
 * @param {object} options - object param to specify the behaviour of the tooltip
 * @param {object} phaserGame - Phaser.Game object
 * through global access
 */
function ProductionTooltipify(options, phaserGame = ns.game.game) {
  const { target } = options;
  let { test } = options;
  if (typeof test !== 'function') {
    test = () => true;
  }
  // lazy instantiation
  if (!tooltip) {
    tooltip = createTooltip(phaserGame);
  }
  target.events.onInputOver.add((item) => {
    if (!test()) return;
    const maxOffsetX = ns.window.width - tooltip.width;
    const maxOffsetY = ns.window.height - tooltip.height;
    const x = item.worldPosition.x + 0;
    const y = item.worldPosition.y - tooltip.height;
    const onScreenX = Math.max(Math.min(x, maxOffsetX), 0);
    const onScreenY = Math.max(Math.min(y, maxOffsetY), 0);

    if (!item.visible) return;

    tooltip.cameraOffset.setTo(onScreenX, onScreenY);
    tooltip.x = onScreenX;
    tooltip.y = onScreenY;
    tooltip.visible = true;

    tooltip.updateContent(item);
  });
  target.events.onInputOut.add(() => {
    if (!test()) return;
    tooltip.visible = false;
  });
}

export { ProductionTooltipify };
export default ProductionTooltip;
