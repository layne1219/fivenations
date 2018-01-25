import SpaceObject from './SpaceObject';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import PlanetAreaGenerator from './PlanetAreaGenerator';
import ForegroundCloudGenerator from './ForegroundCloudGenerator';
import DeepSpaceLayer from './DeepSpaceLayer';
import Background from './Background';
import Foreground from './Foreground';

class Starfield {
  constructor(map, config = {}) {
    this.initLayers();
    this.createBackground(map, config.backgroundTile);
    this.createDeepSpaceObjects(map, config.starfieldGenerator);
    this.createForegroundObjects(map, config.foregroundGenerator);
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

  createForegroundObjects(map, generator) {
    this.layers.push(new Foreground(map, generator));
  }

  resetLayers() {
    // @TODO This is obviously not enough to avoid leaking
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
Starfield.ForegroundCloudGenerator = ForegroundCloudGenerator;

export default Starfield;
