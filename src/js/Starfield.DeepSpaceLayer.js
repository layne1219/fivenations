define('Starfield.DeepSpaceLayer', [
    'Graphics', 
    'Starfield.StarGenerator',
    'Starfield.BackgroundCloudGenerator',
    'Starfield.PlanetGenerator',
    'Starfield.MeteoritesGenerator'
], function(Graphics, StarGenerator, BackgroundCloudGenerator, PlanetGenerator, MeteoritesGenerator) {

    var ns = window.fivenations;
    var width = ns.window.width;
    var height = ns.window.height;
    var i, l, clearLayer;

    function DeepSpaceLayer(game) {
        this.setGame(game);
        this.createTexture();
        this.generateSpaceObjects(new StarGenerator(this.game));
        this.generateSpaceObjects(new BackgroundCloudGenerator(this.game));
        this.generateSpaceObjects(new PlanetGenerator(this.game));
        this.generateSpaceObjects(new MeteoritesGenerator(this.game));
        this.sortSpaceObjects();
    }

    DeepSpaceLayer.prototype = {

        spaceObjects: [],

        setGame: function(game) {
            if (!game) throw 'Phaser.Game instance must be passed as first parameter!';
            this.game = game;
        },

        createTexture: function() {
            var container;
            
            this.texture = this.game.add.renderTexture(width, height, 'Starfield.Stars.Texture');

            container = this.game.add.image(0, 0, this.texture);
            container.fixedToCamera = true;

            Graphics
                .getInstance()
                .getGroup('starfield')
                .add(container);
        },

        generateSpaceObjects: function(generator) {
            if (!generator) throw 'Invalid generator is passed!';
            var spaceObjects = generator.getSpaceObjects();
            spaceObjects.forEach(function(so) {
                this.addSpaceObject(so);
            }.bind(this));
        },

        sortSpaceObjects: function() {
            this.spaceObject.sort(function(a, b){
                return return b.z - a.z;
            });
        }

        addSpaceObject: function(spaceObject) {
            if (!spaceObject) return;
            this.spaceObjects.push(spaceObject);
        },

        update: function() {
            for (i = 0, l = this.spaceObjects.length; i < l; i += 1) {
                clearLayer = i === 0;
                this.spaceObjects[i].update(this.texture, this.game, clearLayer);
            }
        }

    }

    return DeepSpaceLayer;
});
