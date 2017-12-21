function SpaceObject(sprite) {
  this.sprite = sprite;
}

SpaceObject.prototype = {
  sprite: null,

  setX(x) {
    this.x = x;
    return this;
  },

  setY(y) {
    this.y = y;
    return this;
  },

  setZ(z) {
    this.z = z;
    return this;
  },

  setScale(scale) {
    this.sprite.scale.setTo(scale, scale);
    return this;
  },

  setFrame(frame) {
    this.sprite.frame = frame;
    return this;
  },

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
  },
};

export default SpaceObject;
