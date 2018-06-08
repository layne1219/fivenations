/* global window, Phaser */
const ns = window.fivenations;

export default class Panel extends Phaser.Group {
  constructor() {
    super(ns.game.game);
    this.initDefaultAttributes();
  }

  /**
   * Initialises the default attributes of the panel Image object
   */
  initDefaultAttributes() {
    this.x = 0;
    this.y = 0;
    this.fixedToCamera = true;
  }

  /**
   * Attaches the Panel object to the a random Phaser.Game element
   * @param {object} panel Main GUI Group
   * @return {void}
   */
  appendTo(parent) {
    parent.add(this);
  }
}
