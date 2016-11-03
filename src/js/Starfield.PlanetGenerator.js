define('Starfield.PlanetGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator',
    'Util'
], function(SpaceObject, SpaceObjectGenerator, Util) {

    function PlanetGenerator(deepSpaceLayer) {
        SpaceObjectGenerator.call(this, deepSpaceLayer);
    }

    PlanetGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    PlanetGenerator.prototype.constructor = PlanetGenerator;

    PlanetGenerator.prototype.generate = function(numberOfPlanets) {
        SpaceObjectGenerator.prototype.generate.call(this);

        this.createPlanet(numberOfPlanets);
    }

    PlanetGenerator.prototype.createPlanet = function(numberOfPlanets) {
        if (!numberOfPlanets) numberOfPlanets = 1;
        for (var i = 0; i < numberOfPlanets; i += 1) {
            this.createRandomizedPlanet();
        }
    };

    PlanetGenerator.prototype.createRandomizedPlanet = function() {
        var NUMBER_OF_TYPES = 2;
        var NUMBER_OF_FRAMES = 10;

        var map = this.deepSpaceLayer.getMap();
        var sprites = this.deepSpaceLayer.getSprites();
        var type = Util.rnd(1, NUMBER_OF_TYPES);
        var sprite = sprites['planet' + type];
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
        var x = Math.floor(Util.rnd(0, map.getScreenWidth()) / z);
        var y = Math.floor(Util.rnd(0, map.getScreenHeight()) / z);
        var frame = Util.rnd(0, NUMBER_OF_FRAMES - 1);
        var scale = Util.rnd(100, 200) / 100;

        var planet = new SpaceObject(sprite)
            .setX(x)
            .setY(y)
            .setZ(z)
            .setScale(scale)
            .setFrame(frame);

        this.addSpaceObject(planet);
    };

    return PlanetGenerator;

});