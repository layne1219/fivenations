import DeepSpaceLayer from './DeepSpaceLayer';
import Background from './Background';

class Starfield {
  constructor(map) {
    this.initLayers();
    this.createBackground(map);
    this.createDeepSpaceObjects(map);
  }

  initLayers() {
    this.layers = [];
  }

  createBackground(map) {
    this.layers.push(new Background(map));
  }

  createDeepSpaceObjects(map) {
    this.layers.push(new DeepSpaceLayer(map));
  }

  update() {
    this.layers.forEach((layer) => {
      layer.update();
    });
  }
}

export default Starfield;
