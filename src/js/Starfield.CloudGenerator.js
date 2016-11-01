define('Starfield.CloudGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator',
    'Util'
], function(SpaceObject, SpaceObjectGenerator, Util) {

    var ns = window.fivenations;
    var NUMBER_OF_CLOUDS = 10;

    function CloudGenerator(deepSpaceLayer) {
        SpaceObjectGenerator.call(this, deepSpaceLayer);
        this.createClouds();
    }

    CloudGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    CloudGenerator.prototype.constructor = CloudGenerator;

    CloudGenerator.prototype.createClouds = function() {
        for (var i = 0; i < NUMBER_OF_CLOUDS; i += 1) {
            this.createRandomizedCloud();
        }
    };

    CloudGenerator.prototype.createRandomizedCloud = function() {
        var cloud;
        var map = this.deepSpaceLayer.getMap();
        var sprites = this.deepSpaceLayer.getSprites();
        var NUMBER_OF_TYPES = 2;
        var NUMBER_OF_FRAMES = 4;
        var type = Util.rnd(1, NUMBER_OF_TYPES);
        var sprite = sprites['cloud' + type];
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
        var x = Math.floor(Util.rnd(0, map.getScreenWidth()) / z);
        var y = Math.floor(Util.rnd(0, map.getScreenHeight()) / z);
        var frame = Util.rnd(0, NUMBER_OF_FRAMES - 1);
        var scale = Util.rnd(75, 125) / 100;

        cloud = new SpaceObject(sprite)
            .setX(x)
            .setY(y)
            .setZ(z)
            .setScale(scale)
            .setFrame(frame);

        this.addSpaceObject(cloud);
    };

    return CloudGenerator;

});