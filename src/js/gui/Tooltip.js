/* global window, Phaser */
import Graphics from '../common/Graphics';
import {
  DEFAULT_FONT,
  DEFAULT_TOOLTIP_PADDING,
  GROUP_TOOLTIPS,
} from '../common/Const';

const ns = window.fivenations;

// reference for a tooltip instance that can be reused
let tooltip;

/**
 * Generic Tooltip implementation that can be used in conjuntion with
 * Tooltipify() function that automatically adds a Tooltip to an existing
 * Phaser Graphics element
 */
class Tooltip extends Phaser.Group {
  /**
   * Initialise an extended Phaser.Group with the tooltip background
   * and a Text element that can be updated through the exposed API
   * @param {object} phaserGame - Phaser.Game instance
   */
  constructor(phaserGame) {
    super(phaserGame);

    this.setDefaultVisiblity();
    this.initBackgroundSprite(phaserGame);
    this.initTextComponent(phaserGame);
  }

  /**
   * Sets the default visibility of the Group
   */
  setDefaultVisiblity() {
    this.visible = false;
  }

  /**
   * Adds the tooltip background sprite to the Group
   * @param {object} phaserGame - Phaser.Game instance
   */
  initBackgroundSprite(phaserGame) {
    this.background = phaserGame.add.sprite(0, 0, 'gui');
    this.background.frameName = 'XXXgui_descriptionpopup_small.png';
    this.add(this.background);
  }

  /**
   * Adds the Text element to the Group
   * @param {object} phaserGame - Phaser.Game instance
   */
  initTextComponent(phaserGame) {
    const marginLeft = 20;
    const marginTop = 15;

    this.label = this.add(phaserGame.add.text(marginLeft, marginTop, '', {
      font: DEFAULT_FONT.font,
      fill: DEFAULT_FONT.color,
    }));
  }

  /**
   * Updates the label of the Tooltip according to the given string
   * @param {string} text
   */
  updateContent(text) {
    this.label.text = text;
  }
}

/**
 * Creates a Tooltip object and adds it to the Tooltip Graphics Group
 * @param {object} phaserGame - Phaser.Game object
 */
function createTooltip(phaserGame) {
  const group = Graphics.getInstance().getGroup(GROUP_TOOLTIPS);
  tooltip = new Tooltip(phaserGame);
  group.add(tooltip);
  return tooltip;
}

/**
 * Attaches tooltip popup to an excisting element on a Phaser stage
 * @param {object} options - object param to specify the behaviour of the tooltip
 * @param {object} phaserGame - Phaser.Game object
 * through global access
 */
function Tooltipify(options, phaserGame = ns.game.game) {
  const { target, label } = options;
  // lazy instantiation
  if (!tooltip) {
    tooltip = createTooltip(phaserGame);
  }
  target.events.onInputOver.add((item) => {
    const labelValue = typeof label === 'function' ? label() : label;
    const maxOffsetX = ns.window.width - tooltip.width;
    const maxOffsetY = ns.window.height - tooltip.height;
    const x = item.world.x + DEFAULT_TOOLTIP_PADDING.x;
    const y = item.world.y + DEFAULT_TOOLTIP_PADDING.y;

    if (!item.visible) return;
    if (!labelValue) return;

    tooltip.x = Math.max(Math.min(x, maxOffsetX), 0);
    tooltip.y = Math.max(Math.min(y, maxOffsetY), 0);
    tooltip.visible = true;

    tooltip.updateContent(labelValue);
  });
  target.events.onInputOut.add(() => {
    tooltip.visible = false;
  });
}

export { Tooltipify };
export default Tooltip;
