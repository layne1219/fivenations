import EntitySizes from './EntitySizes';
import Util from '../common/Util';

const backgroundFrames = {
    'big': 162,
    'extrabig': 162,
    'medium': 167,
    'small': 172
};

export default class StatusBar {

    constructor({ phaserGame, width, color }) {
        if (undefined === width) {
            width = 1;
        }

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

            Object.keys(EntitySizes).forEach(function(size) {
                if (Util.between(width, EntitySizes[size][0], EntitySizes[size][1])) {
                    this.size = size;
                }
            }, this);
        }

        return this.size;
    }

    getGroup() {
        return this.group;
    }
}
