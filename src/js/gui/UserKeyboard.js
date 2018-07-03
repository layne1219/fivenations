/* global Phaser */
/* eslint class-methods-use-this: 0 */
/* eslint no-loop-func: 0 */
import Util from '../common/Util';

let dispatcher;
let cursors;
let phaserGame;
let singleton;

class UserKeyboard {
  constructor() {
    this.init();
    this.registerEventListeners();
  }

  init() {
    dispatcher = new Util.EventDispatcher();
    cursors = phaserGame.input.keyboard.createCursorKeys();
  }

  registerEventListeners() {
    // Delete
    const keyDelete = phaserGame.input.keyboard.addKey(Phaser.Keyboard.DELETE);
    keyDelete.onDown.add(() => {
      dispatcher.dispatch('key/delete');
    });

    // ESC
    const keyEsc = phaserGame.input.keyboard.addKey(Phaser.Keyboard.ESC);
    keyEsc.onDown.add(() => {
      dispatcher.dispatch('key/esc');
    });

    // Control groups
    for (let i = 9; i >= 0; i -= 1) {
      const key = phaserGame.input.keyboard.addKey(i.toString().charCodeAt(0));
      key.onDown.add(() => dispatcher.dispatch(`key/${i}`));
    }
  }

  update() {
    this.listenToCursorKeys();
  }

  listenToCursorKeys() {
    if (cursors.up.isDown) {
      dispatcher.dispatch('cursor/up');
    } else if (cursors.down.isDown) {
      dispatcher.dispatch('cursor/down');
    }

    if (cursors.left.isDown) {
      dispatcher.dispatch('cursor/left');
    } else if (cursors.right.isDown) {
      dispatcher.dispatch('cursor/right');
    }
  }

  reset() {
    dispatcher.reset();
  }

  /**
   * Shorthand to register listeners against the given event
   * through the built-in EventDispatcher
   * @param {string} event - id of the event
   * @param {function} callback
   */
  on(event, callback) {
    dispatcher.addEventListener(event, callback);
    return this;
  }

  /**
   * Shorthand to remove event listener
   * @param {string} event - id of the event
   * @param {function} callback
   */
  remove(event, callback) {
    dispatcher.removeEventListener(event, callback);
  }

  isDown(keyCode) {
    return phaserGame.input.keyboard.isDown(keyCode);
  }
}

export default {
  setGame(game) {
    phaserGame = game;
  },

  getInstance(forceNewInstance) {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton || forceNewInstance) {
      singleton = new UserKeyboard();
    }
    return singleton;
  },
};
