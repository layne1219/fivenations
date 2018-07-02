/* global window, Phaser */
const ns = window.fivenations;

/**
 * Realises the building placement display
 */
class BuildingPlacementDisplay extends Phaser.Group {
  /**
   * @param {object} config - Configuration object
   */
  constructor() {
    super(ns.game.game);
  }

  /**
   * Makes the popup visible
   */
  show() {
    this.visible = true;
  }

  /**
   * Makes the popup hide
   */
  hide() {
    this.visible = false;
  }
}

export default BuildingPlacementDisplay;
