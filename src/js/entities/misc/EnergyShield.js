import Util from '../../common/Util';
import Graphics from '../../common/Graphics';
import {
  ENTITY_GUI_SIZES,
  SHIELD_ACTIVITY_TRESHOLD,
  ENERGY_SHIELD,
} from '../../common/Const';

const ANIM_ID = 'damage';

class EnergyShield {
  constructor(phaserGame) {
    this.game = phaserGame;
  }

  appendTo(entity) {
    this.sprite = this.createSpriteByParent(entity);

    // Add the selection to the appropriate graphics group as per its type
    const groupName = entity.getDataObject().isBuilding()
      ? 'energy-shields-buildings'
      : 'energy-shields';
    Graphics.getInstance()
      .getGroup(groupName)
      .add(this.sprite);

    entity.on('damage', this.onDamage.bind(this));
    entity.on('remove', this.remove.bind(this));

    // the sprite is not a child of the entity for various overlapping issues
    // therefore it needs to follow it upon every tick
    this.sprite.update = function update() {
      this.x = entity.getSprite().x;
      this.y = entity.getSprite().y;
    };

    this.parent = entity;
  }

  createSpriteByParent(parent) {
    const width = parent.getDataObject().getWidth();
    const height = parent.getDataObject().getHeight();
    const sprite = this.game.add.image(0, 0, ENERGY_SHIELD.sprite);
    const ratio = width / ENERGY_SHIELD.width;
    sprite.visible = false;
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(ratio, ratio);

    const anim = sprite.animations.add(ANIM_ID, ENERGY_SHIELD.animation.frames);
    anim.onComplete.add(this.animationCompleted, this);

    return sprite;
  }

  onDamage() {
    if (this.parent.getDataObject().getShield() >= SHIELD_ACTIVITY_TRESHOLD) {
      this.show();
    }
  }

  show() {
    this.sprite.visible = true;
    this.sprite.play(ANIM_ID, ENERGY_SHIELD.animation.rate);
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
}

export default EnergyShield;
