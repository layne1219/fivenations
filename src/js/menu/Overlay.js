/* global window, Phaser */
/* eslint class-methods-use-this: 0 */
const ns = window.fivenations;

class Overlay extends Phaser.Group {
  /**
   * Creats an Overlay instance
   */
  constructor(game) {
    super(game);
    this.initOverlay();
    this.setAnchorToCentre();
  }

  /**
   * Redrawing the rectangle showing the viewport of the phaser camera object
   * @return {void}
   */
  initOverlay() {
    const { width, height } = ns.window;
    const color = '0x000000';
    this.graphics = this.game.add.graphics(0, 0);
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
