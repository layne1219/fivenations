define('Starfield.MeteoritesGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator',
    'Util'
], function(SpaceObject, SpaceObjectGenerator, Util) {

    var ns = window.fivenations;
    var width = ns.window.width;
    var height = ns.window.height;
    var sprite;

    function MeteoritesGenerator(game) {
        SpaceObjectGenerator.call(this, game);
        createSprites.call(this);
        createMeteorites.call(this)
    }

    MeteoritesGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    MeteoritesGenerator.prototype.constructor = MeteoritesGenerator;

    function createSprites() {
        if (sprite) return;
        sprite = this.game.make.sprite(0, 0, 'starfield.meteorites');
    }

    function createMeteorites(savedData) {
        var numberOfMeteorites = DENSITY;
        if (savedData) {
            savedData.forEach(function(data) {
                var meteorite = createMeteorite(data);
                this.addSpaceObject(meteorite);
            }.bind(this));
        }
    }

    function createMeteorite(data) {
        if (!data) throw 'Invalid data passed to generate BackgroundCould object!';
        var meteorite;

        sprite.frame = data.frame || 0;
        sprite.scale = data.scale || 1;
            
        meteorite = new SpaceObject()
            .setX(data.x)
            .setY(data.y)
            .setZ(data.z)
            .setSprite(sprite);

        return meteorite;
    }

    return MeteoritesGenerator;
});
