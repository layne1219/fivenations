/* global window, Phaser */
/* eslint class-methods-use-this: 0 */
const ns = window.fivenations;

class Overlay extends Phaser.Group {
  /**
   * Creats an Overlay instance
   */
  constructor() {
    const phaserGame = ns.game.game;
    super(phaserGame);
    this.initOverlay(phaserGame);
    this.setAnchorToCentre();
  }

  /**
   * Redrawing the rectangle showing the viewport of the phaser camera object
   * @return {void}
   */
  initOverlay(phaserGame) {
    const { width, height } = ns.window;
    const color = '0x000000';
    this.graphics = phaserGame.add.graphics(0, 0);
    this.graphics.beginFill(color);
    this.graphics.drawRect(0, 0, width, height);
    this.graphics.endFill();
    this.graphics.alpha = 0.75;
    this.add(this.graphics);
  }

  /**
   * Sets anchor to the centre of the overlay
   */
  setAnchorToCentre() {
    this.graphics.anchor.setTo(0.5);
  }
}

export default Overlay;
