function Menu() {}

Menu.prototype = {
  create() {
    const text = this.add.text(
      this.game.width * 0.5,
      this.game.height * 0.5,
      'Five Nations',
      {
        font: '42px Arial',
        fill: '#ffffff',
        align: 'center',
      },
    );
    text.anchor.set(0.5);
    this.input.onDown.add(this.onDown, this);
  },

  update() {},

  onDown() {
    this.game.state.start('game-preloader');
  },
};

export default Menu;
