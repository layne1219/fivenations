import SpaceObject from './SpaceObject';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import PlanetAreaGenerator from './PlanetAreaGenerator';
import DeepSpaceLayer from './DeepSpaceLayer';
import Background from './Background';

class Starfield {
  constructor(map, config = {}) {
    this.initLayers();
    this.createBackground(map, config.backgroundTile);
    this.createDeepSpaceObjects(map, config.starfieldGenerator);
  }

  initLayers() {
    this.layers = [];
  }

  createBackground(map, backgroundTile) {
    this.layers.push(new Background(map, backgroundTile));
  }

  createDeepSpaceObjects(map, generator) {
    this.layers.push(new DeepSpaceLayer(map, generator));
  }

  resetLayers() {
    this.layers.splice();
  }

  update() {
    this.layers.forEach((layer) => {
      layer.update();
    });
  }
}

Starfield.SpaceObject = SpaceObject;
Starfield.SpaceObjectGenerator = SpaceObjectGenerator;
Starfield.PlanetAreaGenerator = PlanetAreaGenerator;

export default Starfield;
