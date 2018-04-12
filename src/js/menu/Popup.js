/* global window, Phaser */
import Button from './Button';
import Overlay from './Overlay';
import Util from '../common/Util';

// default styles for the popup
const POPUP = {
  spritesheet: 'mainmenu-elements',
  frames: {
    background: 'mainmenu_popup_type01.png',
  },
  style: {
    font: '16px BerlinSansFB-Reg',
    fill: '#FFFFFF',
    boundsAlignH: 'center',
    wordWrap: true,
    align: 'center',
  },
  padding: 45,
};

const ns = window.fivenations;

/**
 * Realises a basic Popup that inherits from Phaser.Group
 */
class Popup extends Phaser.Group {
  /**
   * @param {object} config - Configuration object
   */
  constructor(config) {
    super(config.game);

    this.config = config || {};

    this.initOverlayComponent(config);
    this.initBasicComponents(config);
    this.initConfirmButton(config);
    this.initEventListener();
    this.setCoordinates(config);
    this.show();
  }

  initOverlayComponent(config) {
    const { overlay } = config;
    if (overlay) {
      const overlayComponent = new Overlay(this.game);
      overlayComponent.x = -overlayComponent.width / 2;
      overlayComponent.y = -overlayComponent.height / 2;
      this.add(overlayComponent);
    }
  }

  /**
   * Instantiate the components
   * @param {object} config - configuration object to specify the button
   */
  initBasicComponents(config) {
    const {
      offsetX,
      offsetY,
      spritesheet,
      frameName,
      text,
      textOffsetX,
      textOffsetY,
    } = config;

    this.background = this.game.add.sprite(
      offsetX || 0,
      offsetY || 0,
      spritesheet || POPUP.spritesheet,
    );
    this.background.frameName = frameName || POPUP.frames.background;
    this.background.anchor.set(0.5);

    this.add(this.background);

    if (text) {
      this.text = this.game.add.text(textOffsetX || 0, textOffsetY || 0, text, {
        ...POPUP.style,
        wordWrapWidth: this.background.width - POPUP.padding,
      });
      this.text.anchor.set(0.5);
      this.add(this.text);
    }
  }

  /**
   * Generates the Confirm button according to the given
   * configuration object
   * @param {object} config - Configuration object
   */
  initConfirmButton(config) {
    const {
      game, buttonLabel, onClick, buttonOffsetX, buttonOffsetY,
    } = config;
    if (onClick) {
      this.button = new Button({
        game,
        label: buttonLabel,
        onClick: () => {
          onClick();
          this.eventDispatcher.dispatch('dismiss');
        },
      });
      this.button.x = buttonOffsetX || 0;
      this.button.y =
        this.background.height / 2 -
        this.button.height / 2 -
        POPUP.padding +
        (buttonOffsetY || 0);

      this.add(this.button);
    }
  }

  initEventListener() {
    this.eventDispatcher = new Util.EventDispatcher();
  }

  setCoordinates({ x, y }) {
    const cX = x || ns.window.width / 2;
    const cY = y || ns.window.height / 2;
    this.x = cX;
    this.y = cY;
    this.fixedToCamera = true;
    this.cameraOffset.setTo(cX, cY);
  }

  /**
   * Updates the button instance according to the passed configuration object
   * @param {object config - specify the updates
   */
  update(config) {
    if (!config) return;
    if (config.text) this.text = config.text;
  }

  /**
   * Makes the popup visible
   */
  show() {
    this.visible = true;
    if (this.config.pauseGame) {
      this.game.paused = true;
      this.game.physics.arcade.isPaused = this.game.paused;
    }
    this.eventDispatcher.dispatch('show');
  }

  /**
   * Makes the popup hide
   */
  hide() {
    this.visible = false;
    if (this.config.pauseGame) {
      this.game.paused = false;
      this.game.physics.arcade.isPaused = this.game.paused;
    }
    this.eventDispatcher.dispatch('hide');
  }

  /**
   * Registers custom callbacks to the passed events
   * @param {string} event
   * @param {function} callback
   */
  on(event, callback) {
    this.eventDispatcher.addEventListener(event, callback);
  }
}

export default Popup;
