define('Starfield.PlanetAreaGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator',
    'Util'
], function(SpaceObject, SpaceObjectGenerator, Util) {
    
    function PlanetAreaGenerator(deepSpaceLayer) {
        SpaceObjectGenerator.call(this, deepSpaceLayer.getGame());
    }

    PlanetAreaGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    PlanetAreaGenerator.prototype.constructor = PlanetAreaGenerator;

});