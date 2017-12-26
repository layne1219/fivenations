/* global Phaser */
/* eslint class-methods-use-this: 0 */
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

  on(event, callback) {
    dispatcher.addEventListener(event, callback);
    return this;
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
