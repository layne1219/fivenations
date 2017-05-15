import Graphics from '../common/Graphics';

const SPRITE_WIDTH = 234;

export default class ColorIndicator {

    constructor(phaserGame) {
        this.game = phaserGame; 
    }    

    appendTo(entity) {

        var groupName;

        this.sprite = this.createSpriteByParent(entity);

        // Add the selection to the appropriate graphics group as per its type
        groupName = 'color-indicators';
        Graphics.getInstance().getGroup(groupName).add(this.sprite);

        entity.on('remove', this.remove.bind(this));

        // the sprite is not a child of the entity for various overlapping issues
        // therefore it needs to follow it upon every tick 
        this.sprite.update = function() {
            this.x = entity.getSprite().x;
            this.y = entity.getSprite().y;
        };

        this.parent = entity;
    }

    createSpriteByParent(entity) {
        const team = entity.getPlayer().getTeam();
        const width = entity.getDataObject().getWidth();
        const ratio = width / SPRITE_WIDTH * 1.75;
        const sprite = this.game.add.image(0, 0, 'color-indicator');

        sprite.visible = true;
        sprite.anchor.setTo(0.5, 0.5);
        sprite.scale.setTo(ratio, ratio);
        sprite.frame = team - 1;
        
        return sprite;
    }

    show() {
        this.sprite.visible = true;
    }

    hide() {
        this.sprite.visible = false;
    }

    remove() {
        this.sprite.destroy(true);
    }

}
