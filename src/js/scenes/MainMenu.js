import Header from '../menu/Header';

class MainMenu {
  /**
   * Creates the Phaser scene
   */
  create() {
    this.createBackground();
    this.createHeader();
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
}

export default MainMenu;
