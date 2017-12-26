import CloudGenerator from './CloudGenerator';
import PlanetGenerator from './PlanetGenerator';
import SpaceObjectGenerator from './SpaceObjectGenerator';

function PlanetAreaGenerator(deepSpaceLayer) {
  SpaceObjectGenerator.call(this, deepSpaceLayer);
}

PlanetAreaGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
PlanetAreaGenerator.prototype.constructor = PlanetAreaGenerator;

PlanetAreaGenerator.prototype.generate = () => {
  SpaceObjectGenerator.prototype.generate.call(this);
  this.createPlanet();
  this.createClouds();
};

PlanetAreaGenerator.prototype.createPlanet = () => {
  const generator = new PlanetGenerator(this.deepSpaceLayer);
  generator.generate();
  generator.getSpaceObjects().forEach((obj) => {
    this.addSpaceObject(obj);
  });
};

PlanetAreaGenerator.prototype.createClouds = () => {
  const generator = new CloudGenerator(this.deepSpaceLayer);
  generator.generate(0.25);
  generator.getSpaceObjects().forEach((obj) => {
    this.addSpaceObject(obj);
  });
};

export default PlanetAreaGenerator;
