function SpaceObject(sprite) {
    this.sprite = sprite;
}

SpaceObject.prototype = {

    sprite: null,

    setX: function(x) {
        this.x = x;
        return this;
    },

    setY: function(y) {
        this.y = y;
        return this;
    },

    setZ: function(z) {
        this.z = z;
        return this;
    },

    setScale: function(scale) {
        this.sprite.scale.setTo(scale, scale);
        return this;
    },

    setFrame: function(frame) {
        this.sprite.frame = frame;
        return this;
    },

    update: function(texture, game, clearLayer) {
        if (!texture || !this.sprite) {
            return;
        }
        texture.renderXY(
            this.sprite,
            this.x - game.camera.x * this.z,
            this.y - game.camera.y * this.z, !!clearLayer
        );
    }

};

export default SpaceObject;
