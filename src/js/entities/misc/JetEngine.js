/* global Phaser */
import Graphics from '../../common/Graphics';
import { GROUP_ENTITIES } from '../../common/Const';

export default class JetEngine {
  constructor(phaserGame) {
    this.game = phaserGame;
  }

  appendTo(entity) {
    const groupName = GROUP_ENTITIES;

    this.sprite = this.createSpriteByParent(entity);

    // Add the selection to the appropriate graphics group as per its type
    Graphics.getInstance()
      .getGroup(groupName)
      .add(this.sprite);

    entity.on('move', () => this.show());
    entity.on('stop', () => this.hide());
    entity.on('remove', () => this.remove());
    entity.on('hibernate', () => this.hide());
    entity.on('reactivated', () => this.show());

    this.parent = entity;
  }

  createSpriteByParent(entity) {
    const dataObject = entity.getDataObject();
    const sprite = this.game.add.image(0, 0, entity.getJetEngineSprite());
    const frames = dataObject.getJetEngineFrames();
    const id = dataObject.getId();
    const frames = frames[id];

    sprite.visible = false;
    sprite.anchor.setTo(0.5, 0.5);
    sprite.alphaDefault = dataObject.getJetEngineAlphaOffset();
    sprite.alpha = sprite.alphaDefault;

    // the sprite is not a child of the entity for various overlapping issues
    // therefore it needs to follow it upon every tick
    sprite.update = function update() {
      const angleCode = entity.getMotionManager().getCurrentAngleCode();
      const entitySprite = entity.getSprite();
      this.x = entitySprite.x;
      this.y = entitySprite.y + entitySprite.anchor.y;
      this.frame = frames[angleCode];
    };

    return sprite;
  }

  show() {
    if (!this.sprite.visible) {
      this.sprite.visible = true;
      this.tween = this.parent.game.add
        .tween(this.sprite)
        .to({ alpha: 1 }, 100, Phaser.Easing.Bounce.Out, true)
        .loop();
      this.tween.start();
    }
  }

  hide() {
    if (this.tween) this.tween.stop();
    this.sprite.alpha = this.sprite.alphaDefault;
    this.sprite.visible = false;
  }

  remove() {
    this.sprite.destroy(true);
  }
}
