import Header from '../menu/Header';

class MainMenu {
  /**
   * Creates the Phaser scene
   */
  create() {
    this.createBackground();
    this.createHeader();
    this.input.onDown.add(this.onDown, this);
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
    const header = new Header(this.game);
    this.add(header);
  }

  onDown() {
    this.game.state.start('game-preloader');
  }
}

export default MainMenu;
