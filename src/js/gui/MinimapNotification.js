import { MINIMIZED_WIDTH, MINIMIZED_HEIGHT } from './Minimap';

const DEFAULT_ANIMATION_DURATION = 100;
const DEFAULT_ANIMATION_REPEAT = 3;
const DEFAULT_SIZE = 75;
/**
 * MinimapNotification implementation that can be used to display
 * any form of Notification on the Minimap
 */
class MinimapNotification {
  /**
   * Initialise a notification
   * @param {object} config
   */
  constructor(config) {
    const {
      minimap, map, x, y,
    } = config;
    this.x = x;
    this.y = y;
    this.minimap = minimap;
    this.map = map;
    this.ttl = DEFAULT_ANIMATION_DURATION;
    this.repeat = DEFAULT_ANIMATION_REPEAT;
  }

  /**
   * Adds the semi transparent background to the Group
   */
  update(graphics) {
    if (this.ttl > 0) {
      const size = this.ttl / DEFAULT_ANIMATION_DURATION * DEFAULT_SIZE;
      const x = this.x / this.map.getScreenWidth() * MINIMIZED_WIDTH;
      const y = this.y / this.map.getScreenHeight() * MINIMIZED_HEIGHT;
      graphics.lineStyle(1, '0xffaa00', 1);
      graphics.drawRect(x - size / 2, y - size / 2, size, size);
      this.ttl -= 1;
    } else if (this.repeat > 1) {
      this.ttl = DEFAULT_ANIMATION_DURATION;
      this.repeat -= 1;
    } else {
      this.minimap.removeNotification(this);
    }
  }
}

export default MinimapNotification;
