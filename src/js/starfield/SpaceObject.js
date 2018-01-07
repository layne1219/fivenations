import { ANIMATION_IDLE_FOREVER } from '../common/Const';

class SpaceObject {
  constructor(sprite) {
    this.sprite = sprite;
  }

  setX(x) {
    this.x = x;
    return this;
  }

  setY(y) {
    this.y = y;
    return this;
  }

  setZ(z) {
    this.z = z;
    return this;
  }

  setScale(scale) {
    this.sprite.scale.setTo(scale, scale);
    return this;
  }

  setFrame(frame) {
    this.sprite.frame = frame;
    return this;
  }

  setAnimation(animationDescriptor) {
    if (!animationDescriptor || typeof animationDescriptor !== 'object') return;
    Object.keys(animationDescriptor).forEach((key) => {
      const data = animationDescriptor[key];
      const animationOffset = animationDescriptor.animationOffset || 0;
      const frames = data.frames.map(v => v + animationOffset);
      this.sprite.animations.add(key, frames, data.rate, data.loopable);
      // if the animation is called `idle-forever` it is started straightaway
      if (key === ANIMATION_IDLE_FOREVER) {
        this.sprite.animations.play(key);
      }
    });
  }

  update(texture, game, clearLayer) {
    if (!texture || !this.sprite) {
      return;
    }
    texture.renderXY(
      this.sprite,
      this.x - game.camera.x * this.z,
      this.y - game.camera.y * this.z,
      !!clearLayer,
    );
  }

  remove() {
    this.sprite.destroy();
  }
}

export default SpaceObject;
