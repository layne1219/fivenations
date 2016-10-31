define('Starfield.PlanetAreaGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator',
    'Util'
], function(SpaceObject, SpaceObjectGenerator, Util) {
    
    var NUMBER_OF_CLOUDS = 10;

    function PlanetAreaGenerator(deepSpaceLayer) {
        SpaceObjectGenerator.call(this, deepSpaceLayer);
        this.sprites = this.deepSpaceLayer.getSprites();
    }

    PlanetAreaGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    PlanetAreaGenerator.prototype.constructor = PlanetAreaGenerator;

	function createClouds(savedData) {
        var numberOfClouds = NUMBER_OF_CLOUDS;
        if (!savedData) {
            for (var i = 0; i < numberOfClouds; i += 1) {
                cloud = createRandomizedCloud();
                this.addSpaceObject(cloud);
            }
        }
    }

    function createRandomizedCloud() {
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
        var cloud;

		var NUMBER_OF_TYPES = 2;
        var NUMBER_OF_FRAMES = 4;
        var type = Util.rnd(1, NUMBER_OF_TYPES);
        var sprite = this.sprites['cloud' + type];
        var x = Util.rnd(0, width);
        var y = Util.rnd(0, height);
        var frame = Util.rnd(0, NUMBER_OF_FRAMES - 1);
        var scale = Util.rnd(75, 125) / 100;

        cloud = new SpaceObject(sprite)
            .setX(x)
            .setY(y)
            .setZ(z)
            .setScale(scale)
            .setFrame(frame);

        return cloud;
    }


});