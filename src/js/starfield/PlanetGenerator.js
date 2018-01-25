/* global window */
import SpaceObject from './SpaceObject';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import Util from '../common/Util';

const ns = window.fivenations;

class PlanetGenerator extends SpaceObjectGenerator {
  generate(numberOfPlanets) {
    this.createPlanet(numberOfPlanets);
  }

  createPlanet(numberOfPlanets = 1) {
    for (let i = 0; i < numberOfPlanets; i += 1) {
      this.createRandomizedPlanet();
    }
  }

  createRandomizedPlanet() {
    const NUMBER_OF_TYPES = 2;
    const NUMBER_OF_FRAMES = 10;
    const screenWidth = ns.window.width;
    const screenHeight = ns.window.height;

    const map = this.deepSpaceLayer.getMap();
    const type = Util.rnd(1, NUMBER_OF_TYPES);
    const sprite = this.deepSpaceLayer.getSprite(`planet${type}`);
    const z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
    const x = Math.floor(Util.rnd(0, map.getScreenWidth() - screenWidth) * z);
    const y = Math.floor(Util.rnd(0, map.getScreenHeight() - screenHeight) * z);
    const frame = Util.rnd(0, NUMBER_OF_FRAMES - 1);
    const scale = Util.rnd(100, 200) / 100;

    const planet = new SpaceObject(sprite)
      .setX(x)
      .setY(y)
      .setZ(z)
      .setScale(scale)
      .setFrame(frame);

    this.addSpaceObject(planet);
  }
}

export default PlanetGenerator;
