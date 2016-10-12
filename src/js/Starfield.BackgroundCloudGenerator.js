define('Starfield.BackgroundCloudGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator',
    'Util'
], function(SpaceObject, SpaceObjectGenerator, Util) {

    var DENSITY = 5;
    var ns = window.fivenations;
    var width = ns.window.width;
    var height = ns.window.height;
    var sprites;

    function BackgroundCloudGenerator(game) {
        SpaceObjectGenerator.call(this, game);
        createSprites.call(this);
        createClouds.call(this)
    }

    BackgroundCloudGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    BackgroundCloudGenerator.prototype.constructor = BackgroundCloudGenerator;

    function createSprites() {

        if (sprites) return;

        sprites = {
            type1: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-1'),
            type2: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-2')
        };
    }

    function createClouds(savedData) {
        var numberOfClouds = DENSITY;
        if (!savedData){
            for (var i = 0; i < numberOfClouds; i += 1) {
                cloud = createRandomizedCloud();
                this.addSpaceObject(cloud);
            }
        }
    }

    function createRandomizedCloud() {
        var z = getRandomizedZ();
        var cloud;

        cloud = new SpaceObject()
            .setX(Util.rnd(0, width))
            .setY(Util.rnd(0, height))
            .setZ(z)
            .setSprite(getRandomizedSprite());

        return cloud;
    }

    function getRandomizedZ() {
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
        return z;
    }

    function getRandomizedSprite() {
        var NUMBER_OF_TYPES = 2;
        var NUMBER_OF_FRAMES = 4;
        var type = Util.rnd(1, NUMBER_OF_TYPES);
        var sprite = getSpriteByType(type);
        var scale = Util.rnd(75, 125) / 100;
        sprite.frame = Util.rnd(1, NUMBER_OF_FRAMES);
        sprite.scale.setTo(scale, scale);
        return sprite;
    }

    function getSpriteByType(type) {
        if (!type) throw 'Invalid type was given to fetch sprite!';
        return sprites['type' + type];   
    }    

    function createCloud(x, y, type) {
        var cloud = new SpaceObject()
            .setX(x)
            .setY(y)
            .setZ(z)
            .setSprite(getSpriteByType(type));

        return cloud;
    }

    return BackgroundCloudGenerator;
});
