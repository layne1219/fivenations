import Graphics from '../common/Graphics';
import PlanetAreaGenerator from './PlanetAreaGenerator';

const ns = window.fivenations;
let sprites;

function DeepSpaceLayer(map) {
    this.setMap(map);
    this.setGame(map.getGame());
    this.createTexture();
    this.createSprites();
    this.createSpaceObjects();
}

DeepSpaceLayer.prototype = {

    spaceObjects: [],

    setMap: function(map) {
        if (!map) throw 'Map instance must be passed as first parameter!';
        this.map = map;
    },

    setGame: function(game) {
        if (!game) throw 'Phaser.Game instance must be passed as first parameter!';
        this.game = game;
    },

    createTexture: function() {
        const width = ns.window.width;
        const height = ns.window.height;
        let container;
                
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
            var SpaceObjectLoader = function() {};
            this.loadSpaceObjects(new SpaceObjectLoader(this, savedData));
        } else {
            this.generateSpaceObjects(new PlanetAreaGenerator(this));
        }
        this.sortSpaceObjects();
    },

    generateSpaceObjects: function(generator) {
        if (!generator) throw 'Invalid generator instance!';
        generator.generate();
        this.spaceObjects = generator.getSpaceObjects();
    },

    loadSpaceObjects: function(loader) {
        if (!loader) throw 'Invalid loader instance!';
        loader.load();
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

    getMap: function() {
        return this.map;
    },

    getSprites: function() {
        return sprites;
    }

}

export default DeepSpaceLayer;
