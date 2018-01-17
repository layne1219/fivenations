/* global window, Phaser */
import { DEFAULT_FONT, DEFAULT_TOOLTIP_PADDING } from '../common/Const';

const ns = window.fivenations;
const phaserGameFromGlobalScope = ns.game.game;
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
    this.background.frame = 'XXXgui_descriptionpopup_small.png';
    this.add(this.background);
  }

  /**
   * Adds the Text element to the Group
   * @param {object} phaserGame - Phaser.Game instance
   */
  initTextComponents(phaserGame) {
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
 * @param {object} phaserGame - if omitted it uses the Phaser.Game object
 */
function createTooltip(phaserGame = phaserGameFromGlobalScope) {
  const group = Graphics.getInstance().getGroup(GROUP_TOOLTIPS);
  tooltip = new Tooltip(phaserGame);
  group.add(tooltip);
  return tooltip;
}

/**
 * Attaches tooltip popup to an excisting element on a Phaser stage
 * @param {object} options - object param to specify the behaviour of the tooltip
 * @param {object} phaserGame - if omitted it uses the Phaser.Game object
 * through global access
 */
function Tooltipify(options, phaserGame = phaserGameFromGlobalScope) {
  const { target, label } = options;
  // lazy instantiation
  if (!tooltip) {
    createTooltip(phaserGame);
  }
  target.on('over', (item) => {
    const labelValue = typeof label === 'function' ? label() : label;

    if (!item.visible) return;
    if (!labelValue.toString().length) return;

    tooltip.x = item.x + DEFAULT_TOOLTIP_PADDING.x;
    tooltip.y = item.y - tooltip.height + DEFAULT_TOOLTIP_PADDING.y;
    tooltip.visible = true;

    tooltip.updateContent(labelValue);
  });
  target.on('out', () => {
    tooltip.visible = false;
  });
}

export { Tooltipify };
export default Tooltip;
