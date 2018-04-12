/* global window */
import Header from '../menu/Header';

const ns = window.fivenations;

class MainMenu {
  /**
   * Creates the Phaser scene
   */
  create() {
    this.createBackground();
    this.createHeader();
    this.createWebellionLogo();
    this.createDemoButton();
  }

  /**
   * Creates the background element
   */
  createBackground() {
    this.game.add.image(0, 0, 'menu-background-1');
  }

  /**
   * Creates the header element
   */
  createHeader() {
    this.header = new Header(this.game);
  }

  /**
   * Creates Demo Button
   */
  createDemoButton() {
    const callback = () => this.game.state.start('game-preloader');
    this.demoButton = this.game.add.button(
      0,
      0,
      'mainmenu-elements',
      callback,
      this,
      'mainmenu_01campaign_chapterframe_comingsoong.png',
      'mainmenu_01campaign_chapterframe.png',
      'mainmenu_01campaign_chapterframe_comingsoong.png',
    );
    this.demoButton.anchor.set(0.5);

    const text = this.game.add.text(0, 0, 'Play Demo', {
      font: '25px conthraxsemibold',
      fill: '#99eded',
      boundsAlignH: 'center',
      wordWrap: true,
      align: 'center',
      wordWrapWidth: this.demoButton.width,
    });
    text.anchor.set(0.5);

    this.demoButton.x = 75 + this.demoButton.width / 2;
    this.demoButton.y = 150 + this.demoButton.height / 2;
    text.x = this.demoButton.x;
    text.y = this.demoButton.y + 5;
  }

  /**
   * Creates Webellion logo
   */
  createWebellionLogo() {
    const padding = 25;
    this.companyLogo = this.createElement({
      id: 'mainmenu_logo_webellion.png',
    });
    this.companyLogo.x = ns.window.width - this.companyLogo.width - padding;
    this.companyLogo.y = ns.window.height - this.companyLogo.height - padding;
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
    return sprite;
  }
}

export default MainMenu;
