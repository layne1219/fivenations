import CloudGenerator from './CloudGenerator';
import PlanetGenerator from './PlanetGenerator';
import SpaceObjectGenerator from './SpaceObjectGenerator';

class PlanetAreaGenerator extends SpaceObjectGenerator {
  generate() {
    this.createPlanet();
    this.createClouds();
  }

  createPlanet() {
    const generator = new PlanetGenerator(this.deepSpaceLayer);
    generator.generate();
    generator.getSpaceObjects().forEach((obj) => {
      this.addSpaceObject(obj);
    });
  }

  createClouds() {
    const generator = new CloudGenerator(this.deepSpaceLayer);
    generator.generate(0.25);
    generator.getSpaceObjects().forEach((obj) => {
      this.addSpaceObject(obj);
    });
  }
}

export default PlanetAreaGenerator;
