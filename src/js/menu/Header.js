/* global Phaser */
import HeaderButton from './HeaderButton';
import TranslationManager from '../common/TranslationManager';

class Header extends Phaser.Group {
  constructor(game) {
    super(game);

    this.addBackground();
    this.addButtons();
  }

  addBackground() {
    this.createElement({ id: 'mainmenu_header.png' });
  }

  addButtons() {
    const translator = TranslationManager.getInstance();
    const button = new HeaderButton({
      game: this.game,
      label: translator.translate('mainmenu.campaign'),
      onClick: () => console.log('button clicked'),
    });
    button.x = 100;
    button.y = 50;
    this.add(button);
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
