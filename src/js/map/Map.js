import Starfield from '../starfield/Starfield';
import FogOfWar from './FogOfWar';
import FogOfWarRenderer from './FogOfWarRenderer';
import Util from '../common/Util';

const FOG_OF_WAR_REFRESH_RATE = 5;

const MIN_WIDTH = 32;
const MIN_HEIGHT = 32;
const TILE_WIDTH = 40;
const TILE_HEIGHT = 40;
const SCROLL_SPEED = 10;

let width = MIN_WIDTH * TILE_WIDTH;
let height = MIN_HEIGHT * TILE_HEIGHT;

let game;

let starfield;
let fogOfWar;
let fogOfWarRenderer;
let fogOfWarDirty = false;

function Map(_game) {
  this.initGame(_game);
}

Map.prototype = {
  new(config) {
    this.setSize(config);
    this.initLayers(config);
  },

  update(entityManager) {
    if (starfield) starfield.update();
    if (fogOfWar) {
      fogOfWar.optimizedUpdate(entityManager);
      if (fogOfWarDirty) {
        fogOfWarRenderer.update();
        fogOfWarDirty = false;
      }
    }
  },

  initGame(_game) {
    game = _game;
    game.stage.backgroundColor = '#000';
  },

  setSize(config) {
    { width, height } = config;
    game.world.setBounds(0, 0, this.getScreenWidth(), this.getScreenHeight());
  },

  initLayers() {
    // initializes the separate layers
    starfield = new Starfield(this);
    fogOfWar = new FogOfWar(this);
    fogOfWarRenderer = new FogOfWarRenderer(fogOfWar);

    // generates a function for updating the FogOfWar fields
    // only at the given regular intervals so that to save CPU time
    fogOfWar.optimizedUpdate = Util.interval(
      (entityManager) => {
        fogOfWar.update(entityManager);
        fogOfWarDirty = true;
      },
      FOG_OF_WAR_REFRESH_RATE,
      fogOfWar,
    );
  },

  scrollTo(x, y) {
    game.camera.x = x;
    game.camera.y = y;
    fogOfWarDirty = true;
  },

  scrollToTile(x, y) {
    this.scrollTo(x * TILE_WIDTH, y * TILE_HEIGHT);
  },

  scrollLeft(extent) {
    game.camera.x -= extent || SCROLL_SPEED;
    fogOfWarDirty = true;
  },

  scrollRight(extent) {
    game.camera.x += extent || SCROLL_SPEED;
    fogOfWarDirty = true;
  },

  scrollUp(extent) {
    game.camera.y -= extent || SCROLL_SPEED;
    fogOfWarDirty = true;
  },

  scrollDown(extent) {
    game.camera.y += extent || SCROLL_SPEED;
    fogOfWarDirty = true;
  },

  getScreenWidth() {
    return TILE_WIDTH * width;
  },

  getScreenHeight() {
    return TILE_HEIGHT * height;
  },

  getWidth() {
    return width;
  },

  getHeight() {
    return height;
  },

  getTileWidth() {
    return TILE_WIDTH;
  },

  getTileHeight() {
    return TILE_HEIGHT;
  },

  getFogOfWar() {
    return fogOfWar;
  },

  getGame() {
    return game;
  },
};

export default Map;
