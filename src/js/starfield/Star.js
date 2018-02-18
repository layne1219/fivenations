/* global window */
import SpaceObject from './SpaceObject';

const ns = window.fivenations;

/**
 * SpaceObject that is repositioned when gets off screen
 */
class Star extends SpaceObject {
  /**
   * Returns an instance of Star class that will be automatically
   * repositioned when gets off the predefined screen dimensions
   */
  constructor(sprite) {
    super(sprite);
    this.setOffScreenDimensions();
  }

  /**
   * Sets the current window dimensions that is used to determine
   * whether the star is off screen or not
   */
  setOffScreenDimensions() {
    const { width, height } = ns.window;
    this.offScreen = {
      width,
      height,
    };
  }

  /**
   * Updates the Star at every tick when the parent layer is considered
   * "dirty" and then repositions it randomly
   * @param {object} texture - Phaser.Texture
   * @param {game} game - Phaser.Game
   * @param {boolean} clear - whether the texture must be cleared
   */
  update(texture, game, clear) {
    super.update(texture, game, clear);

    // assesses whether the star is drifted off screen
    if (this.x + (this.sprite.width - game.camera.x * this.z) < 0) {
      this.setX(this.x + this.sprite.width + this.offScreen.width);
    } else if (this.x - game.camera.x * this.z > this.offScreen.width) {
      this.setX(this.x - this.sprite.width - this.offScreen.width);
    } else if (this.y + (this.sprite.height - game.camera.y * this.z) < 0) {
      this.setY(this.y + this.sprite.height + this.offScreen.height);
    } else if (this.y - game.camera.y * this.z > this.offScreen.height) {
      this.setY(this.y - this.sprite.height - this.offScreen.height);
    }
  }
}

export default Star;
