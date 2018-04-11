/* global Phaser */
import HeaderButton from './HeaderButton';
import TranslationManager from '../common/TranslationManager';

// list of buttons appear on the top header
// translation stands for the key in the translation file
// submenu stands for the id of the scene the click event
// will trigger to transition into
const BUTTONS = [
  {
    translation: 'mainmenu.campaign',
    submenu: 'menu-campaign',
  },
  {
    translation: 'mainmenu.skirmish',
    submenu: 'menu-skirmish',
  },
  {
    translation: 'mainmenu.multiplayer',
    submenu: 'menu-multiplayer',
  },
  {
    translation: 'mainmenu.howtoplay',
    submenu: 'menu-howtoplay',
  },
  {
    translation: 'mainmenu.spacemarket',
    submenu: 'menu-spacemarket',
  },
];

/**
 * Phaser.Group class that realises the MainMenu header
 */
class Header extends Phaser.Group {
  constructor(game) {
    super(game);

    this.addBackground();
    this.addFiveNationsLogo();
    this.addButtons();
  }

  /**
   * Adds the header background element
   */
  addBackground() {
    this.createElement({ id: 'mainmenu_header.png' });
  }

  /**
   * Creates the FV logo
   */
  addFiveNationsLogo() {
    this.logo = this.createElement({
      y: -11,
      id: 'mainmenu_logo_fivenations.png',
    });
    this.logoSeparator = this.createElement({
      x: this.logo.x + this.logo.width,
      id: 'mainmenu_header_optionseparator.png',
    });
  }

  /**
   * Add all menu buttons
   */
  addButtons() {
    const translator = TranslationManager.getInstance();
    let previous;
    BUTTONS.forEach((config) => {
      const offsetY = 0;
      let offsetX;
      if (previous) {
        offsetX = previous.x + previous.width / 2;
      } else {
        offsetX = this.logoSeparator.x + this.logoSeparator.width;
      }
      const button = this.addButton({
        label: translator.translate(config.translation),
        onClick: () => this.game.state.start(config.submenu),
        x: offsetX,
        y: offsetY,
      });
      previous = button;
    });
  }

  /**
   * Adds Button to the Header
   * @param {object} config - { x, y, label, onClick }
   * @return {object} HeaderButton instance
   */
  addButton(config) {
    const {
      x, y, label, onClick,
    } = config;
    const button = new HeaderButton({
      game: this.game,
      label,
      onClick,
    });
    button.x = x + button.width / 2;
    button.y = y + button.height / 2;
    this.add(button);
    return button;
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

export default Header;
