import Util from '../common/Util';

let phaserGame;
let dispatcher;
let multiselector;
let singleton;

function UserPointer() {
  init.call(this);
  registerEventListeners.call(this);
}

function init() {
  dispatcher = new Util.EventDispatcher();
  multiselector = new Phaser.Rectangle(0, 0, 0, 0);
  multiselector.active = false;
}

function registerEventListeners() {
  // Releasing either of the mouse buttons
  phaserGame.input.onUp.add(() => {
    dispatcher.dispatch('up');

    if (multiselector.active) {
      if (multiselector.width > 0 || multiselector.height > 0) {
        dispatcher.dispatch('multiselector/up', multiselector);
      }

      multiselector.active = false;
      multiselector.x = 0;
      multiselector.y = 0;
      multiselector.width = 0;
      multiselector.height = 0;
    }
  }, this);

  // Pressing either of the mouse buttons
  phaserGame.input.onDown.add(function () {
    // left mouse button
    if (phaserGame.input.mousePointer.leftButton.isDown) {
      dispatcher.dispatch('leftbutton/down', this);

      multiselector.active = true;
      multiselector.x = phaserGame.camera.x + phaserGame.input.mousePointer.x;
      multiselector.y = phaserGame.camera.y + phaserGame.input.mousePointer.y;
      multiselector.width = 0;
      multiselector.height = 0;
    } else if (phaserGame.input.mousePointer.rightButton.isDown) {
      // right mouse button
      dispatcher.dispatch('rightbutton/down', this);
    }

    // invoking all the registred functions for the the unified event
    dispatcher.dispatch('down');
  }, this);
}

UserPointer.prototype = {
  on(event, callback) {
    dispatcher.addEventListener(event, callback);
  },

  remove(event, callback) {
    dispatcher.removeEventListener(event, callback);
  },

  dispatch() {
    const args = [].slice.call(arguments);
    dispatcher.dispatch(...args);
  },

  stopMultiselection() {
    multiselector.active = 0;
    multiselector.width = 0;
    multiselector.height = 0;
  },

  update() {
    phaserGame.debug.geom(multiselector, '#0fffff', false);

    if (phaserGame.input.mousePointer.leftButton.isDown) {
      dispatcher.dispatch('leftbutton/move', this);
    }

    if (phaserGame.input.mousePointer.leftButton.isDown && multiselector.active) {
      if (phaserGame.camera.x + phaserGame.input.mousePointer.x < multiselector.x) {
        this.stopMultiselection();
        return;
      }
      if (phaserGame.camera.y + phaserGame.input.mousePointer.y < multiselector.y) {
        this.stopMultiselection();
        return;
      }
      multiselector.width = Math.abs(multiselector.x - (phaserGame.camera.x + phaserGame.input.mousePointer.x));
      multiselector.height = Math.abs(multiselector.y - (phaserGame.camera.y + phaserGame.input.mousePointer.y));
    }
  },

  isLeftButtonDown() {
    return phaserGame.input.mousePointer.leftButton.isDown;
  },

  isRightButtonDown() {
    return phaserGame.input.mousePointer.rightButton.isDown;
  },

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
      sprite.x - sprite.offsetX + sprite.width
    ) {
      return false;
    }
    if (phaserGame.camera.y + phaserGame.input.mousePointer.y < sprite.y - sprite.offsetY) {
      return false;
    }
    if (
      phaserGame.camera.y + phaserGame.input.mousePointer.y >
      sprite.y - sprite.offsetY + sprite.height
    ) {
      return false;
    }
    return true;
  },

  getRealCoords() {
    return {
      x: phaserGame.camera.x + phaserGame.input.mousePointer.x,
      y: phaserGame.camera.y + phaserGame.input.mousePointer.y,
    };
  },
};

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
      throw 'Invoke setGame first to pass the Phaser Game entity!';
    }
    if (!singleton || forceNewInstance) {
      singleton = new UserPointer();
    }
    return singleton;
  },
};
