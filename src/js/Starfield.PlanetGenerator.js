define('Starfield.PlanetGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator',
    'Util'
], function(SpaceObject, SpaceObjectGenerator, Util) {

    var DENSITY = 1;
    var ns = window.fivenations;
    var width = ns.window.width;
    var height = ns.window.height;
    var sprites;

    function PlanetGenerator(game) {
        SpaceObjectGenerator.call(this, game);
        createSprites.call(this);
        createPlanets.call(this)
    }

    PlanetGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    PlanetGenerator.prototype.constructor = PlanetGenerator;

    function createSprites() {

        if (sprites) return;

        sprites = {
            type1: this.game.make.sprite(0, 0, 'starfield.planets.type-1'),
            type2: this.game.make.sprite(0, 0, 'starfield.planets.type-2')
        };
    }

    function createPlanets(savedData) {
        var numberOfPlanets;
        var planet;
        if (!savedData) {
            numberOfPlanets = DENSITY;
            for (var i = 0; i < numberOfPlanets; i += 1) {
                planet = createRandomizedPlanet();
                this.addSpaceObject(planet);
            }
        }
    }

    function createRandomizedPlanet() {
        var z = getRandomizedZ();
        var planet;

        planet = new SpaceObject()
            .setX(Util.rnd(0, width))
            .setY(Util.rnd(0, height))
            .setZ(z)
            .setSprite(getRandomizedSprite());

        return planet;
    }

    function getRandomizedZ() {
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
        return z;
    }

    function getRandomizedSprite() {
        var NUMBER_OF_TYPES = 2;
        var NUMBER_OF_FRAMES = 10;
        var type = Util.rnd(1, NUMBER_OF_TYPES);
        var sprite = getSpriteByType(type);
        var scale = Util.rnd(100, 150) / 100;
        sprite.frame = Util.rnd(1, NUMBER_OF_FRAMES);
        sprite.scale.setTo(scale, scale);
        return sprite;
    }

    function getSpriteByType(type) {
        if (!type) throw 'Invalid type was given to fetch sprite!';
        return sprites['type' + type];   
    }    

    function createPlanet(x, y, type) {
        var cloud = new SpaceObject()
            .setX(x)
            .setY(y)
            .setZ(z)
            .setSprite(getSpriteByType(type));

        return cloud;
    }

    return PlanetGenerator;
});
