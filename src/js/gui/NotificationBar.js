/* global window, Phaser */
import Graphics from '../common/Graphics';
import { DEFAULT_FONT, NOTIFICATION_PANEL, GROUP_GUI } from '../common/Const';

const ns = window.fivenations;

// reference for a notification singleton instance that can be reused
let singleton;

/**
 * Notification bar implementation that can be used to display
 * any form of Notification on the top of the game stage
 */
class NotificationBar extends Phaser.Group {
  /**
   * Initialise an extended Phaser.Group with the notification background
   * and a Text element that can be updated through the exposed API
   * @param {object} phaserGame - Phaser.Game instance
   */
  constructor(phaserGame) {
    super(phaserGame);
    this.setFixedToTheCamera();
    this.setDefaultVisiblity();
    this.initBackground(phaserGame);
    this.initTextComponent(phaserGame);
  }

  /**
   * Sets the this Phaser.Group fixed to the Camera
   */
  setFixedToTheCamera() {
    this.fixedToCamera = true;
  }

  /**
   * Sets the default visibility of the Group
   */
  setDefaultVisiblity() {
    this.visible = false;
  }

  /**
   * Adds the semi transparent background to the Group
   * @param {object} phaserGame - Phaser.Game instance
   */
  initBackground(phaserGame) {
    const graphics = phaserGame.add.graphics(0, 0);
    const { width, height } = NOTIFICATION_PANEL;
    const color = 0x000000;
    graphics.beginFill(color);
    graphics.drawRect(0, 0, width, height);
    graphics.alpha = 0.5;
    this.add(graphics);
  }

  /**
   * Adds the Text element to the Group
   * @param {object} phaserGame - Phaser.Game instance
   */
  initTextComponent(phaserGame) {
    this.label = this.add(phaserGame.add.text(0, 0, '', {
      font: DEFAULT_FONT.font,
      fill: DEFAULT_FONT.color,
      boundsAlignH: 'center',
      boundsAlignV: 'middle',
    }));

    this.label.setTextBounds(
      0,
      0,
      NOTIFICATION_PANEL.width,
      NOTIFICATION_PANEL.height,
    );
  }

  /**
   * Updates the label of the NotificationBar according to the given string
   * @param {string} text
   */
  updateContent(text) {
    this.label.text = text;
  }
}

/**
 * Creates a NotificationBar object and adds it to the NotificationBar Graphics Group
 * @param {object} phaserGame - Phaser.Game object
 */
function createNotificationBar(phaserGame) {
  const group = Graphics.getInstance().getGroup(GROUP_GUI);
  const onScreenX = 0;
  const onScreenY = NOTIFICATION_PANEL.offsetY;
  const notification = new NotificationBar(phaserGame);
  notification.cameraOffset.setTo(onScreenX, onScreenY);
  notification.x = onScreenX;
  notification.y = onScreenY;
  group.add(notification);
  return notification;
}

export default {
  /**
   * sets the global Phaser.Game instance
   * @param {void}
   */
  setGame(game) {
    phaserGame = game;
  },

  /**
   * returns singleton instance of the manager object
   * @return {object} Singleton instance of NotificationBar
   */
  getInstance() {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton) {
      singleton = new NotificationBar(phaserGame);
    }
    return singleton;
  },
};
