// ************************************************************************************************
// 												Starfield 
// ************************************************************************************************
define('Starfield', [
    'Starfield.DeepSpaceLayer', 
    'Starfield.Background'
], function(DeepSpaceLayer, Background) {

    function Starfield(map) {
        initialise.call(this, map);
    }

    function initialise(map) {
        this.initLayers();
        this.createBackground(map.getGame());
        this.createDeepSpaceObjects(map.getGame());
    }

    Starfield.prototype = {

        initLayers: function() {
            this.layers = [];
        },

        createBackground: function(game) {
            this.layers.push(new Background(game));
        },        

        createDeepSpaceObjects: function(game) {
            this.layers.push(new DeepSpaceLayer(game));
        },

        update: function() {

            this.layers.forEach(function(layer) {
                layer.update();
            });

        }

    };

    return Starfield;
});