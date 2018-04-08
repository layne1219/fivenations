class MainMenu {
  create() {
    this.createBackground();
    this.input.onDown.add(this.onDown, this);
  }

  createBackground() {
    this.game.add.image(0, 0, 'menu-background-1');
  }

  onDown() {
    this.game.state.start('game-preloader');
  }
}

export default MainMenu;
