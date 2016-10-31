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
    var sprites = {};

    function DeepSpaceLayer(game) {
        this.setGame(game);
        this.createTexture();
        this.createSprites();
        this.createSpaceObjects();
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

        createSprites: function() {
            if (sprites) return;
            sprites = {
                cloud1: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-1'),
                cloud2: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-2'),
                meteorites: this.game.make.sprite(0, 0, 'starfield.meteorites'),
                planet1: this.game.make.sprite(0, 0, 'starfield.planets.type-1'),
                planet2: this.game.make.sprite(0, 0, 'starfield.planets.type-2')
            };
        },

        createSpaceObjects: function(savedData) {
            if (savedData) {
                this.loadSpaceObjects(new SpaceObjectLoader(this, savedData));
            } else {
                this.generateSpaceObjects(new PlanetAreaGenerator(this));
            }
            this.sortSpaceObjects();
        },

        generateSpaceObjects: function(generator) {
            if (!generator) throw 'Invalid generator instance!';
            this.spaceObjects = generator.getSpaceObjects(););
        },

        loadSpaceObjects: function(loader) {
            if (!loader) throw 'Invalid loader instance!';
            this.spaceObjects = loader.getSpaceObjects();
        },

        sortSpaceObjects: function() {
            this.spaceObjects.sort(function(a, b){
                return a.z - b.z;
            });
        },

        update: function() {
            var i, l;
            for (i = 0, l = this.spaceObjects.length; i < l; i += 1) {
                this.spaceObjects[i].update(this.texture, this.game, i === 0);
            }
        },

        getGame: function() {
            return this.game;
        },

        getSprites: function() {
            return this.sprites;
        }

    }

    return DeepSpaceLayer;
});
