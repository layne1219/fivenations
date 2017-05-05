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
let height = MIN_HEIGHT * TILE_HEIGHt;
let scrollSpeed = SCROLL_SPEED;

let starfield;
let fogofwar;

function initGame( { _game } ) {
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

function Map() {}

Map.prototype = {

    new: function(config) {
        setSize(config);
        initGame(config);
        initLayers(config);
    },

    update: function(entityManager) {
        starfield.update();
        fogofwar.update(entityManager);
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
