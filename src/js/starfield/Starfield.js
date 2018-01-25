import SpaceObject from './SpaceObject';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import PlanetAreaGenerator from './PlanetAreaGenerator';
import ForegroundCloudGenerator from './ForegroundCloudGenerator';
import DeepSpaceLayer from './DeepSpaceLayer';
import Background from './Background';
import Foreground from './Foreground';

class Starfield {
  constructor(map, config = {}) {
    this.createBackground(map, config.backgroundTile);
    this.createDeepSpaceObjects(map, config.starfieldGenerator);
    this.createForegroundObjects(map, config.foregroundGenerator);
  }

  createBackground(map, backgroundTile) {
    this.background = new Background(map, backgroundTile);
  }

  createDeepSpaceObjects(map, generator) {
    this.deepSpaceLayer = new DeepSpaceLayer(map, generator);
  }

  createForegroundObjects(map, generator) {
    this.foreground = new Foreground(map, generator);
  }

  resetLayers() {
    // @TODO This is obviously not enough to avoid leaking
    this.layers.splice();
  }

  update() {
    this.background.update();
    this.deepSpaceLayer.update();
    this.foreground.update();
  }

  getBackground() {
    return this.background;
  }

  getDeepSpaceLayer() {
    return this.deepSpaceLayer;
  }

  getForeground() {
    return this.foreground;
  }
}

Starfield.SpaceObject = SpaceObject;
Starfield.SpaceObjectGenerator = SpaceObjectGenerator;
Starfield.PlanetAreaGenerator = PlanetAreaGenerator;
Starfield.ForegroundCloudGenerator = ForegroundCloudGenerator;

export default Starfield;
