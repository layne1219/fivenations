import Graphics from '../common/Graphics';
import EntitySizes from './EntitySizes';
import Util from '../common/Util';

const ANIM_FRAME_RATE = 25;
const ANIM_ID = 'damage';
const animations = {
    'energy-shield-big': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    'energy-shield-medium': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    'energy-shield-small': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]    
};

export default class EnergyShield {

    constructor(phaserGame) {
        this.game = phaserGame; 
    }

    appendTo(entity) {

        var groupName;

        this.sprite = this.createSpriteByParent(entity);

        // Add the selection to the appropriate graphics group as per its type
        groupName = entity.getDataObject().isBuilding() ? 'energy-shields-buildings' : 'energy-shields';
        Graphics.getInstance().getGroup(groupName).add(this.sprite);

        entity.on('damage', this.onDamage.bind(this));
        entity.on('remove', this.remove.bind(this));

        // the sprite is not a child of the entity for various overlapping issues
        // therefore it needs to follow it upon every tick 
        this.sprite.update = function() {
            this.x = entity.getSprite().x;
            this.y = entity.getSprite().y;
        };

        this.parent = entity;
    }

    createSpriteByParent(parent) {
        var width = parent.getDataObject().getWidth();
        var height = parent.getDataObject().getHeight();
        var size = this.getSize(width, height);
        var spriteName = 'energy-shield-' + size;
        var sprite = this.game.add.image(0, 0, spriteName);
        sprite.visible = false;
        sprite.anchor.setTo(0.5, 0.5);
    
        var anim = sprite.animations.add(ANIM_ID, animations[spriteName]);
        anim.onComplete.add(this.animationCompleted, this);
        
        return sprite;
    }

    onDamage() {
        if (this.parent.getDataObject().getShield() > 0) {
            this.show();
        }
    }

    show() {
        this.sprite.visible = true;
        this.sprite.play(ANIM_ID, ANIM_FRAME_RATE);
    }

    hide() {
        this.sprite.visible = false;
    }

    remove() {
        this.sprite.destroy(true);
    }

    animationCompleted() {
        this.hide();
    }

    getSize(width, height) {

        if (!this.size) {

            Object.keys(EntitySizes).forEach(function(size) {
                if (Util.between(Math.max(width, height), EntitySizes[size][0], EntitySizes[size][1])) {
                    if (size === 'extrabig') {
                        this.size = 'big';
                    } else {
                        this.size = size;
                    }
                }
            }, this);
        }

        return this.size;
    }

}
