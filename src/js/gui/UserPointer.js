/* global Phaser */
/* eslint class-methods-use-this: 0 */
import Util from '../common/Util';

let phaserGame;
let singleton;

class UserPointer {
  constructor() {
    this.init();
    this.registerEventListeners();
  }

  init() {
    this.dispatcher = new Util.EventDispatcher();
    this.multiselector = new Phaser.Rectangle(0, 0, 0, 0);
    this.multiselector.active = false;
  }

  registerEventListeners() {
    // Releasing either of the mouse buttons
    phaserGame.input.onUp.add(() => {
      this.dispatcher.dispatch('up');

      if (this.multiselector.active) {
        if (this.multiselector.width > 0 || this.multiselector.height > 0) {
          this.dispatcher.dispatch('this.multiselector/up', this.multiselector);
        }

        this.multiselector.active = false;
        this.multiselector.x = 0;
        this.multiselector.y = 0;
        this.multiselector.width = 0;
        this.multiselector.height = 0;
      }
    });

    // Pressing either of the mouse buttons
    phaserGame.input.onDown.add(() => {
      // left mouse button
      if (phaserGame.input.mousePointer.leftButton.isDown) {
        this.dispatcher.dispatch('leftbutton/down', this);

        this.multiselector.active = true;
        this.multiselector.x = phaserGame.camera.x + phaserGame.input.mousePointer.x;
        this.multiselector.y = phaserGame.camera.y + phaserGame.input.mousePointer.y;
        this.multiselector.width = 0;
        this.multiselector.height = 0;
      } else if (phaserGame.input.mousePointer.rightButton.isDown) {
        // right mouse button
        this.dispatcher.dispatch('rightbutton/down', this);
      }

      // invoking all the registred functions for the the unified event
      this.dispatcher.dispatch('down');
    });
  }

  on(event, callback) {
    this.dispatcher.addEventListener(event, callback);
  }

  remove(event, callback) {
    this.dispatcher.removeEventListener(event, callback);
  }

  dispatch(...args) {
    this.dispatcher.dispatch.apply(this, args);
  }

  stopMultiselection() {
    this.multiselector.active = 0;
    this.multiselector.width = 0;
    this.multiselector.height = 0;
  }

  update() {
    phaserGame.debug.geom(this.multiselector, '#0fffff', false);

    if (phaserGame.input.mousePointer.leftButton.isDown) {
      this.dispatcher.dispatch('leftbutton/move', this);
    }

    if (phaserGame.input.mousePointer.leftButton.isDown && this.multiselector.active) {
      if (phaserGame.camera.x + phaserGame.input.mousePointer.x < this.multiselector.x) {
        this.stopMultiselection();
        return;
      }
      if (phaserGame.camera.y + phaserGame.input.mousePointer.y < this.multiselector.y) {
        this.stopMultiselection();
        return;
      }
      this.multiselector.width = Math.abs(this.multiselector.x - (phaserGame.camera.x + phaserGame.input.mousePointer.x));
      this.multiselector.height = Math.abs(this.multiselector.y - (phaserGame.camera.y + phaserGame.input.mousePointer.y));
    }
  }

  isLeftButtonDown() {
    return phaserGame.input.mousePointer.leftButton.isDown;
  }

  isRightButtonDown() {
    return phaserGame.input.mousePointer.rightButton.isDown;
  }

  /**
   * Returning whether the mouse pointer is over the passed Phaser.Game.Sprite object
   * @param  {object}  sprite [Phaser.Game.Sprite]
   * @return {Boolean} [returns true if the mouse pointer is over the target item]
   */
  isHover(sprite) {
    if (phaserGame.camera.x + phaserGame.input.mousePointer.x < sprite.x - sprite.offsetX) {
      return false;
    }
    if (
      phaserGame.camera.x + phaserGame.input.mousePointer.x >
      sprite.x - (sprite.offsetX + sprite.width)
    ) {
      return false;
    }
    if (phaserGame.camera.y + phaserGame.input.mousePointer.y < sprite.y - sprite.offsetY) {
      return false;
    }
    if (
      phaserGame.camera.y + phaserGame.input.mousePointer.y >
      sprite.y - (sprite.offsetY + sprite.height)
    ) {
      return false;
    }
    return true;
  }

  getRealCoords() {
    return {
      x: phaserGame.camera.x + phaserGame.input.mousePointer.x,
      y: phaserGame.camera.y + phaserGame.input.mousePointer.y,
    };
  }
}

export default {
  /**
   * Passing the ultimate Phaser.Game object in order to access basic Phaser functionality
   * @param {void}
   */
  setGame(game) {
    phaserGame = game;
  },

  /**
   * Fetching the singleton instance of the UserPointer protoype
   * @param {boolean forceNewInstance
   * @return {object} UserPointer
   */
  getInstance(forceNewInstance) {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton || forceNewInstance) {
      singleton = new UserPointer();
    }
    return singleton;
  },
};
