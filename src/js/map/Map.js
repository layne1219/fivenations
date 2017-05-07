import Starfield from '../starfield/Starfield';
import Fogofwar from './Fogofwar';
import Util from '../common/Util';

const FOG_OF_WAR_REFRESH_RATE = 50;

// map configration template
const MIN_WIDTH = 32;
const MIN_HEIGHT = 32;
const TILE_WIDTH = 40;
const TILE_HEIGHT = 40;
const SCROLL_SPEED = 10;

let game;
let width = MIN_WIDTH * TILE_WIDTH;
let height = MIN_HEIGHT * TILE_HEIGHT;

let starfield;
let fogofwar;

function initGame(_game) {
    game = _game;
    game.stage.backgroundColor = '#000';
}

function setSize({_width, _height}) {
    width = _width;
    height = _height;
    game.world.setBounds(0, 0, this.getScreenWidth(), this.getScreenHeight());
}

function initLayers() {
    starfield = new Starfield(this);
    fogofwar = Fogofwar.create(this);
    fogofwar.update = Util.interval(fogofwar.update, FOG_OF_WAR_REFRESH_RATE, fogofwar);
}

function Map(game) {
    initGame(game);
}

Map.prototype = {

    new: function(config) {
        setSize(config);
        initLayers(config);
    },

    update: function(entityManager) {
        if (starfield) starfield.update();
        if (fogofwar) fogofwar.update(entityManager);
    },

    scrollTo: function(x, y) {
        game.camera.x = x;
        game.camera.y = y;
    },

    scrollToTile: function(x, y) {
        game.camera.x = x * TILE_WIDTH;
        game.camera.y = y * TILE_HEIGHT;
    },

    scrollLeft: function(extent) {
        game.camera.x -= extent || SCROLL_SPEED;
    },

    scrollRight: function(extent) {
        game.camera.x += extent || SCROLL_SPEED;
    },

    scrollUp: function(extent) {
        game.camera.y -= extent || SCROLL_SPEED;
    },

    scrollDown: function(extent) {
        game.camera.y += extent || SCROLL_SPEED;
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

    getFogofwar: function() {
        return fogofwar;
    }

}

export default Map;
