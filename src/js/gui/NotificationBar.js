/* global Phaser */
import { DEFAULT_FONT, NOTIFICATION_PANEL } from '../common/Const';

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
    this.setDefaultVisiblity();
    this.initBackground();
    this.initTextComponent();
  }

  /**
   * Sets the default visibility of the Group
   */
  setDefaultVisiblity() {
    this.visible = false;
  }

  /**
   * Adds the semi transparent background to the Group
   */
  initBackground() {
    const graphics = this.game.add.graphics(0, 0);
    const { width, height } = NOTIFICATION_PANEL;
    const color = 0x000000;
    graphics.beginFill(color);
    graphics.drawRect(0, 0, width, height);
    graphics.alpha = 0.5;
    this.add(graphics);
  }

  /**
   * Adds the Text element to the Group
   */
  initTextComponent() {
    this.label = this.add(this.game.add.text(0, 0, '', {
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
   * Attaches the Notification Bar to the given group
   * @param {object} group
   * @param {number} x - Horizontal offset from the parent's anchor point
   * @param {number} y - Vertical offset from the parent's anchor point
   */
  appendTo(object, x, y) {
    if (!object) {
      throw new Error('Invalid Phaser.Sprite object!');
    }
    object.addChild(this);
    this.x = x;
    this.y = y;
  }

  /**
   * Updates the label of the NotificationBar according to the given string
   * @param {string} text
   */
  updateContent(text) {
    this.label.text = text;
  }

  /**
   * Displays Notification Bar with the fadeIn Tween
   * @param {string} text - Text to be shown on the bar
   */
  show(text) {
    this.updateContent(text);
    this.visible = true;
    // when invoked more than once simultaniously we just update
    // the text on the bar and resets the timer
    if (!this.showAnim) {
      this.alpha = 0;
      this.showAnim = this.game.add
        .tween(this)
        .to(
          { alpha: 1 },
          NOTIFICATION_PANEL.fadeAnimationDuration,
          'Linear',
          true,
        );
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.hide(), NOTIFICATION_PANEL.displayTime);
  }

  /**
   * Makes Notification Bar disapear with a Fade Out Tween
   */
  hide() {
    // guard against multiple calls simultaniously
    if (this.hideAnim) return;
    this.hideAnim = this.game.add
      .tween(this)
      .to(
        { alpha: 0 },
        NOTIFICATION_PANEL.fadeAnimationDuration,
        'Linear',
        true,
      );

    this.hideAnim.onComplete.addOnce(() => {
      this.hideAnim = null;
      this.showAnim = null;
      this.timer = null;
      this.visible = false;
    });
  }
}

export default NotificationBar;
