import Graphics from '../../common/Graphics';
import { ENTITY_GUI_SIZES, SHIELD_ACTIVITY_TRESHOLD } from '../../common/Const';
import Util from '../../common/Util';

const ANIM_FRAME_RATE = 25;
const ANIM_ID = 'damage';
const animations = {
  'energy-shield-big': [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
  ],
  'energy-shield-medium': [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
  ],
  'energy-shield-small': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

export default class EnergyShield {
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
    const size = this.getSize(width, height);
    const spriteName = `energy-shield-${size}`;
    const sprite = this.game.add.image(0, 0, spriteName);
    sprite.visible = false;
    sprite.anchor.setTo(0.5, 0.5);

    const anim = sprite.animations.add(ANIM_ID, animations[spriteName]);
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
      Object.keys(ENTITY_GUI_SIZES).forEach((size) => {
        if (
          Util.between(
            Math.max(width, height),
            ENTITY_GUI_SIZES[size][0],
            ENTITY_GUI_SIZES[size][1],
          )
        ) {
          if (size === 'extrabig') {
            this.size = 'big';
          } else {
            this.size = size;
          }
        }
      });
    }

    return this.size;
  }
}
