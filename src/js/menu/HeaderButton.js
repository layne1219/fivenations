/* global Phaser */
import { MENU_FONT } from '../common/Const';

// configuration for the render text
const TEXT_CONFIG = {
  font: MENU_FONT.font,
  fill: MENU_FONT.color,
  fillOnHover: MENU_FONT.onHover,
  fillOnDisabled: MENU_FONT.onDisabled,
};

class HeaderButton extends Phaser.Group {
  /**
   * Creates the button based on the given configuration object
   * @param {object} config
   */
  constructor(config) {
    super(config.game);

    this.addHighlight(config);
    this.addText(config);
    this.addSeparator(config);
    this.registerListeners(config);
    if (config.disabled) {
      this.disable();
    }
  }

  /**
   * Adds the highlight to the Button
   * @param {object} config
   */
  addHighlight(config) {
    this.highlight = this.createElement({
      id: 'mainmenu_header_option_selection_highlight.png',
    });
    this.highlight.anchor.set(0.5);
    this.highlight.visible = false;
    if (config.active) {
      this.activate();
    }
  }

  /**
   * Adds the label object to the Button
   * @param {object} config
   */
  addText(config) {
    this.label = this.add(this.game.add.text(0, 0, config.label, {
      font: TEXT_CONFIG.font,
      fill: TEXT_CONFIG.fill,
    }));
    this.label.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);
    this.label.anchor.set(0.5);
  }

  /**
   * Adds the separator sprite to the Button
   * @param {object} config
   */
  addSeparator(config) {
    this.separator = this.createElement({
      id: 'mainmenu_header_optionseparator.png',
    });
    this.separator.anchor.set(0.5);
    this.separator.x = this.width / 2;
    if (config.noSeparator) {
      this.separator.visible = false;
    }
  }

  /**
   * Registers event listeners against the button
   * @param {object} config - { onClick: [function] }
   */
  registerListeners(config) {
    const callback = () => {
      this.click(config.onClick);
    };
    this.inputEnableChildren = true;
    this.onChildInputDown.add(callback, this);
    this.onChildInputOver.add(this.over, this);
    this.onChildInputOut.add(this.out, this);
  }

  /**
   * Activates the button to highlight that it has been clicked
   * or selected
   */
  acticate() {
    this.highlight.visible = true;
  }

  /**
   * Activates the button to highlight that it has been clicked
   * or selected
   */
  deacticate() {
    this.highlight.visible = false;
  }

  /**
   * Disable the button so the no event listeners will be executed
   */
  disable() {
    this.disabled = true;
    this.label.fill = TEXT_CONFIG.fillOnDisabled;
  }

  /**
   * Callback function that is attached to the InputDown event
   * of the Phaser.Group
   * @param {function} callback
   */
  click(callback) {
    if (!callback || this.disabled) return;
    this.activate();
    callback();
  }

  /**
   * Invoked when the uesr input hovers the group
   */
  over() {
    if (this.disabled) return;
    this.label.fill = TEXT_CONFIG.fillOnHover;
  }

  /**
   * Invoked when the user input gets off the group
   */
  out() {
    if (this.disabled) return;
    this.label.fill = TEXT_CONFIG.fill;
  }

  /**
   * Creates a Phaser.Sprite instance based on the given configuration
   * @param {object} config - { x, y, id }
   * @return {object} Phaser.Sprite
   */
  createElement(config) {
    const { x, y, id } = config;
    const sprite = this.game.add.sprite(x || 0, y || 0, 'mainmenu-elements');
    sprite.frameName = id;
    this.add(sprite);
    return sprite;
  }
}

export default HeaderButton;
