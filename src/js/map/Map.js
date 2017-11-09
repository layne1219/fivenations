import Starfield from '../starfield/Starfield';
import FogOfWar from './FogOfWar';
import FogOfWarRenderer from './FogOfWarRenderer';
import Util from '../common/Util';

const FOG_OF_WAR_REFRESH_RATE = 50;

const MIN_WIDTH = 32;
const MIN_HEIGHT = 32;
const TILE_WIDTH = 40;
const TILE_HEIGHT = 40;
const SCROLL_SPEED = 10;

let game;
let width = MIN_WIDTH * TILE_WIDTH;
let height = MIN_HEIGHT * TILE_HEIGHT;

let starfield;
let fogOfWar;
let fogOfWarRenderer;
let fogOfWarDirty = false;

function Map(game) {
    this.initGame(game);
}

Map.prototype = {

    new: function(config) {
        this.setSize(config);
        this.initLayers(config);
    },

    update: function(entityManager) {
        if (starfield) starfield.update();
        if (fogOfWar) { 
            fogOfWar.optimizedUpdate(entityManager);
            if (fogOfWarDirty) {
                fogOfWarRenderer.update();
                fogOfWarDirty = false;
            }
        }
    },

    initGame: function(_game) {
        game = _game;
        game.stage.backgroundColor = '#000';
    },
    
    setSize: function(config) {
        width = config.width;
        height = config.height;
        game.world.setBounds(0, 0, this.getScreenWidth(), this.getScreenHeight());
    },

    initLayers: function() {
        // initializes the separate layers
        starfield = new Starfield(this);
        fogOfWar = new FogOfWar(this);
        fogOfWarRenderer = new FogOfWarRenderer(fogOfWar);

        // generates a function for updating the FogOfWar fields
        // only at the given regular intervals so that to save CPU time
        fogOfWar.optimizedUpdate = Util.interval(entityManager => {
            fogOfWar.update(entityManager);
            fogOfWarDirty = true;
        }, FOG_OF_WAR_REFRESH_RATE, fogOfWar);
    },

    scrollTo: function(x, y) {
        game.camera.x = x;
        game.camera.y = y;
        fogOfWarDirty = true;
    },

    scrollToTile: function(x, y) {
        this.scrollTo(x * TILE_WIDTH, y * TILE_HEIGHT);
    },

    scrollLeft: function(extent) {
        game.camera.x -= extent || SCROLL_SPEED;
        fogOfWarDirty = true;
    },

    scrollRight: function(extent) {
        game.camera.x += extent || SCROLL_SPEED;
        fogOfWarDirty = true;
    },

    scrollUp: function(extent) {
        game.camera.y -= extent || SCROLL_SPEED;
        fogOfWarDirty = true;
    },

    scrollDown: function(extent) {
        game.camera.y += extent || SCROLL_SPEED;
        fogOfWarDirty = true;
    },

    getScreenWidth: function() {
        return TILE_WIDTH * width;
    },

    getScreenHeight: function() {
        return TILE_HEIGHT * height;
    },

    getWidth: function() {
        return width;
    },

    getHeight: function() {
        return height;
    },

    getTileWidth: function() {
        return TILE_WIDTH;
    },

    getTileHeight: function() {
        return TILE_HEIGHT;
    },

    getFogOfWar: function() {
        return fogOfWar;
    },

    getGame: function() {
        return game;
    }

}

export default Map;
