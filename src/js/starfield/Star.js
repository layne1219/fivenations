/* global window */
import SpaceObject from './SpaceObject';

const ns = window.fivenations;
const { width, height } = ns.window;

function Star() {
  SpaceObject.call(this);
}

Star.prototype = new SpaceObject();
Star.prototype.constructor = Star;

Star.prototype.update = (texture, game, clear) => {
  SpaceObject.prototype.update.call(this, texture, game, clear);

  // assessing whether the star is drifted off screen
  if (this.x + (this.sprite.width - (game.camera.x * this.z)) < 0) {
    this.setX(this.x + this.sprite.width + width);
  } else if (this.x - (game.camera.x * this.z) > width) {
    this.setX(this.x - this.sprite.width - width);
  } else if (this.y + (this.sprite.height - (game.camera.y * this.z)) < 0) {
    this.setY(this.y + this.sprite.height + height);
  } else if (this.y - (game.camera.y * this.z) > height) {
    this.setY(this.y - this.sprite.height - height);
  }
};

export default Star;
