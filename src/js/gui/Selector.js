import EntitySizes from './EntitySizes';

const SELECT_ANIM_FRAME_RATE = 25;
const FLASH_ANIM_FRAME_RATE = 5;
const animations = {

    'select-enemy-big': [121, 122, 123, 124, 125],
    'select-enemy-extrabig': [126, 127, 128, 129, 130],
    'select-enemy-medium': [131, 132, 133, 134, 135],
    'select-enemy-small': [136, 137, 138, 139, 140],

    'select-big': [141, 142, 143, 144, 145],
    'select-extrabig': [147, 148, 149, 150, 151],
    'select-medium': [152, 153, 154, 155, 156],
    'select-small': [157, 158, 159, 160, 161],

    'flash-enemy-big': [121, 125, 121, 125, 121, 125, 121, 125],
    'flash-enemy-extrabig': [126, 130, 126, 130, 126, 130, 126, 130],
    'flash-enemy-medium': [131, 135, 131, 135, 131, 135, 131, 135],
    'flash-enemy-small': [136, 140, 136, 140, 136, 140, 136, 140],

    'flash-big': [141, 145, 141, 145, 141, 145, 141, 145],
    'flash-extrabig': [147, 151, 147, 151, 147, 151, 147, 151],
    'flash-medium': [152, 156, 152, 156, 152, 156, 152, 156],
    'flash-small': [157, 161, 157, 161, 157, 161, 157, 161],

};

export default class Selector {

    constructor(phaserGame) {

        const sprite = phaserGame.add.image(0, 0, 'gui');
        sprite.visible = false;
        sprite.anchor.setTo(0.5, 0.5);

        Object.keys(animations).forEach(function(animation) {
            var anim = sprite.animations.add(animation, animations[animation]);
            anim.onComplete.add(this.animationCompleted, this);
        }.bind(this));

        this.sprite = sprite;
    }

    appendTo(entity) {

        let groupName;

        if (!entity || 'function' !== typeof entity.getSprite) {
            throw 'First parameter must be an instance of Entity!';
        }

        entity.on('select', this.show.bind(this));
        entity.on('unselect', this.hide.bind(this));
        entity.on('selectedAsTarget', this.flash.bind(this));
        entity.on('remove', this.remove.bind(this));

        // Add the selection to the appropriate graphics group as per its type
        groupName = entity.getDataObject().isBuilding() ? 'selectors-buildings' : 'selectors';
        Graphics.getInstance().getGroup(groupName).add(this.sprite);

        // the sprite is not a child of the entity for various overlapping issues
        // therefore it needs to follow it upon every tick 
        this.sprite.update = function() {
            this.x = entity.getSprite().x;
            this.y = entity.getSprite().y;
        };

        this.parent = entity;
        this.width = this.parent.getDataObject().getWidth();
        this.height = this.parent.getDataObject().getHeight();
    }

    show() {
        const anim = 'select';
        const animationName = this.getAnimationName(anim);
        this.sprite.visible = true;
        this.sprite.play(animationName, SELECT_ANIM_FRAME_RATE);
        this.currentAnim = anim;
    }

    flash() {
        const anim = 'flash';
        const animationName = this.getAnimationName(anim);
        this.sprite.visible = true;
        this.sprite.play(animationName, FLASH_ANIM_FRAME_RATE);
        this.currentAnim = anim;
    }

    hide() {
        this.sprite.visible = false;
    }

    remove() {
        this.sprite.destroy(true);
    }

    animationCompleted() {
        if (this.currentAnim === 'flash') {
            this.hide();
        } 
        this.currentAnim = null;
    }

    getAnimationName(animType) {
        const relationship = (function(selector) {
            if (selector.parent.isEntityControlledByUser()) {
                return '-';
            }
            return '-enemy-';
        })(this);
        const animationName = animType + relationship + this.getSize();
        return animationName;
    }

    getSize() {

        if (!this.parent) {
            throw 'There is no Entity attached to this Selector instance!';
        }

        if (!this.size) {

            Object.keys(EntitySizes).forEach(function(size) {
                if (Util.between(Math.max(this.width, this.height), EntitySizes[size][0], EntitySizes[size][1])) {
                    this.size = size;
                }
            }, this);
        }

        return this.size;
    }

}
