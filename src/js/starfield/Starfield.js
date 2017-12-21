import DeepSpaceLayer from './DeepSpaceLayer';
import Background from './Background';

function Starfield(map) {
  initialise.call(this, map);
}

function initialise(map) {
  this.initLayers();
  this.createBackground(map);
  this.createDeepSpaceObjects(map);
}

Starfield.prototype = {
  initLayers() {
    this.layers = [];
  },

  createBackground(map) {
    this.layers.push(new Background(map));
  },

  createDeepSpaceObjects(map) {
    this.layers.push(new DeepSpaceLayer(map));
  },

  update() {
    this.layers.forEach((layer) => {
      layer.update();
    });
  },
};

export default Starfield;
