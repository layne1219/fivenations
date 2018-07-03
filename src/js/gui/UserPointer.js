/* global Phaser */
/* eslint class-methods-use-this: 0 */
import Util from '../common/Util';
import GUI from '../gui/GUI';
import { DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '../common/Const';

const scrollTreshold = 10;

let phaserGame;
let singleton;

class UserPointer {
  constructor() {
    this.init();
    this.registerEventListeners();
  }

  init() {
    this.dispatcher = new Util.EventDispatcher();
    // helpers to realise multiselection functionality
    this.multiselector = {};
    this.multiselectorRect = new Phaser.Rectangle(0, 0, 0, 0);
    this.multiselector.active = false;
  }

  registerEventListeners() {
    // registers callback against move pointer event
    phaserGame.input.addMoveCallback(this.dispatcher.dispatch.bind(this.dispatcher, 'move', this));

    // Releasing either of the mouse buttons
    phaserGame.input.onUp.add(() => {
      this.dispatcher.dispatch('up');

      if (this.multiselector.active) {
        if (
          this.multiselectorRect.width > 0 ||
          this.multiselectorRect.height > 0
        ) {
          this.dispatcher.dispatch('multiselector/up', this.multiselectorRect);
        }

        this.multiselector.active = false;
        this.multiselectorRect.x = 0;
        this.multiselectorRect.y = 0;
        this.multiselectorRect.width = 0;
        this.multiselectorRect.height = 0;
      }
    });

    // Pressing either of the mouse buttons
    phaserGame.input.onDown.add(() => {
      // left mouse button
      if (phaserGame.input.mousePointer.leftButton.isDown) {
        this.dispatcher.dispatch('leftbutton/down', this);

        this.multiselector.active = true;
        this.multiselector.x =
          phaserGame.camera.x + phaserGame.input.mousePointer.x;
        this.multiselector.y =
          phaserGame.camera.y + phaserGame.input.mousePointer.y;
        this.multiselectorRect.width = 0;
        this.multiselectorRect.height = 0;
      } else if (phaserGame.input.mousePointer.rightButton.isDown) {
        // right mouse button
        this.dispatcher.dispatch('rightbutton/down', this);
      }

      // invoking all the registred functions for the the unified event
      this.dispatcher.dispatch('down');
    });
  }

  /**
   * Invoked when the mouse pointer moves and emits
   */
  emitScrollEvents() {
    const mouseX = phaserGame.input.mousePointer.x;
    const mouseY = phaserGame.input.mousePointer.y;

    if (
      GUI.getInstance().isHover() &&
      phaserGame.input.mousePointer.leftButton.isDown &&
      !this.multiselector.active
    ) {
      return;
    }

    if (mouseX < scrollTreshold) {
      this.dispatcher.dispatch('scroll/left');
    } else if (mouseX + scrollTreshold > DEFAULT_CANVAS_WIDTH) {
      this.dispatcher.dispatch('scroll/right');
    }

    if (mouseY < scrollTreshold) {
      this.dispatcher.dispatch('scroll/up');
    } else if (mouseY + scrollTreshold > DEFAULT_CANVAS_HEIGHT) {
      this.dispatcher.dispatch('scroll/down');
    }
  }

  /**
   * Shorthand to register events through the built-in EventDispatcher
   * @param {string} event - id of the event
   * @param {function} callback
   */
  on(event, callback) {
    this.dispatcher.addEventListener(event, callback);
  }

  /**
   * Shorthand to remove event listener
   * @param {string} event - id of the event
   * @param {function} callback
   */
  remove(event, callback) {
    this.dispatcher.removeEventListener(event, callback);
  }

  dispatch(...args) {
    this.dispatcher.dispatch(...args);
  }

  /**
   * Restore the multiselection data to default
   */
  stopMultiselection() {
    this.multiselector.active = 0;
    this.multiselectorRect.width = 0;
    this.multiselectorRect.height = 0;
  }

  update() {
    const pointer = phaserGame.input.mousePointer;

    // check mouse coordinates for scroll events
    this.emitScrollEvents();

    if (pointer.leftButton.isDown) {
      this.dispatcher.dispatch('leftbutton/move', this);
    }

    if (pointer.leftButton.isDown && this.multiselector.active) {
      this.multiselectorRect.x = Math.min(
        this.multiselector.x,
        pointer.x + phaserGame.camera.x,
      );
      this.multiselectorRect.y = Math.min(
        this.multiselector.y,
        pointer.y + phaserGame.camera.y,
      );
      this.multiselectorRect.width = Math.abs(this.multiselector.x - (phaserGame.camera.x + pointer.x));
      this.multiselectorRect.height = Math.abs(this.multiselector.y - (phaserGame.camera.y + pointer.y));
    }

    phaserGame.debug.geom(this.multiselectorRect, '#0fffff', false);
  }

  isLeftButtonDown() {
    return phaserGame.input.mousePointer.leftButton.isDown;
  }

  isRightButtonDown() {
    return phaserGame.input.mousePointer.rightButton.isDown;
  }

  /**
   * Returning whether the mouse pointer is over the passed Phaser.Game.Sprite object
   * @param {object} sprite - Phaser.Game.Sprite
   * @return {Boolean} [returns true if the mouse pointer is over the target item]
   */
  isHover(sprite) {
    const offsetX = sprite.offsetX || 0;
    const offsetY = sprite.offsetY || 0;
    let mouseX = phaserGame.input.mousePointer.x;
    let mouseY = phaserGame.input.mousePointer.y;

    if (!sprite.fixedToCamera && !sprite.parent.fixedToCamera) {
      mouseX += phaserGame.camera.x;
      mouseY += phaserGame.camera.y;
    }

    if (mouseX < sprite.x + offsetX) {
      return false;
    }
    if (mouseX > sprite.x + (offsetX + sprite.width)) {
      return false;
    }
    if (mouseY < sprite.y + offsetY) {
      return false;
    }
    if (mouseY > sprite.y + (offsetY + sprite.height)) {
      return false;
    }
    return true;
  }

  /**
   * Returns whether the mouse pointer is over the passed Entity
   * @param {object} entity - Entity
   * @return {boolean}
   */
  isHoverEntity(entity) {
    const sprite = entity.getSprite();
    let mouseX = phaserGame.input.mousePointer.x;
    let mouseY = phaserGame.input.mousePointer.y;

    if (!sprite.fixedToCamera) {
      mouseX += phaserGame.camera.x;
      mouseY += phaserGame.camera.y;
    }

    if (mouseX < sprite.x + sprite.hitArea.x) {
      return false;
    }
    if (mouseX > sprite.x + (sprite.hitArea.x + sprite.hitArea.width)) {
      return false;
    }
    if (mouseY < sprite.y + sprite.hitArea.y) {
      return false;
    }
    if (mouseY > sprite.y + (sprite.hitArea.y + sprite.hitArea.height)) {
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

  getScreenCoords() {
    return {
      x: phaserGame.input.mousePointer.x,
      y: phaserGame.input.mousePointer.y,
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
