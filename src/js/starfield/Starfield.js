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

    initLayers: function() {
        this.layers = [];
    },

    createBackground: function(map) {
        this.layers.push(new Background(map));
    },        

    createDeepSpaceObjects: function(map) {
        this.layers.push(new DeepSpaceLayer(map));
    },

    update: function() {

        this.layers.forEach(function(layer) {
            layer.update();
        });

    }

};

export default Starfield;
