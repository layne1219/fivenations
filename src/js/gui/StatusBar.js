import { ENTITY_GUI_SIZES } from '../common/Const';
import Util from '../common/Util';

const backgroundFrames = {
  big: 162,
  extrabig: 162,
  medium: 167,
  small: 172,
};

export default class StatusBar {
  constructor({ phaserGame, width = 1, color }) {
    // wrapper for the background sprite and the dynamic graphics object
    this.group = phaserGame.add.group();

    // background for the StatusBar
    this.sprite = phaserGame.add.sprite(0, 0, 'gui');
    this.sprite.frame = backgroundFrames[this.getSize(width)];

    // fixed colour if is not omitted
    this.color = color;

    // graphics for the dynamic bar
    this.graphics = phaserGame.add.graphics(0, 0);

    // adding the individual elements to the container
    this.group.add(this.sprite);
    this.group.add(this.graphics);
  }

  update(ratio) {
    this.graphics.clear();
    this.graphics.beginFill(this.color || Util.getColorFromRatio(ratio));
    this.graphics.drawRect(1, 1, Math.floor(this.sprite.width * ratio) - 2, 3);
    this.graphics.endFill();
  }

  show() {
    this.group.visible = true;
  }

  hide() {
    this.group.visible = false;
  }

  getSize(width) {
    if (!this.size) {
      Object.keys(ENTITY_GUI_SIZES).forEach((size) => {
        if (Util.between(width, ENTITY_GUI_SIZES[size][0], ENTITY_GUI_SIZES[size][1])) {
          this.size = size;
        }
      });
    }

    return this.size;
  }

  getGroup() {
    return this.group;
  }
}
