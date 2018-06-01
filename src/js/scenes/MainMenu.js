/* global window */
import Header from '../menu/Header';
import ScriptBox from '../common/Scriptbox';

const ns = window.fivenations;

class MainMenu {
  /**
   * Creates the Phaser scene
   */
  create() {
    this.createBackground();
    this.createHeader();
    this.createWebellionLogo();
    this.createDemoButton({
      label: 'Play Demo 1',
      x: 75,
      y: 150,
      script: 'demo1',
    });
    this.createDemoButton({
      label: 'Play Demo 2',
      x: 75,
      y: 250,
      script: 'demo2',
    });
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
  createDemoButton(options) {
    const callback = () => {
      this.game.state.start('game-preloader');
      ScriptBox.getInstance().setCurrentScript(options.script);
    };
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

    const text = this.game.add.text(0, 0, options.label || 'Play Demo', {
      font: '25px conthraxsemibold',
      fill: '#99eded',
      boundsAlignH: 'center',
      wordWrap: true,
      align: 'center',
      wordWrapWidth: this.demoButton.width,
    });
    text.anchor.set(0.5);

    this.demoButton.x = options.x + this.demoButton.width / 2;
    this.demoButton.y = options.y + this.demoButton.height / 2;
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
