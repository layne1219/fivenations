/* global window */
/* eslint prefer-destructuring: 0 */
/* eslint class-methods-use-this: 0 */
import Starfield from '../starfield/Starfield';
import FogOfWar from './FogOfWar';
import FogOfWarRenderer from './FogOfWarRenderer';
import CollisionMap from './CollisionMap';
import Util from '../common/Util';
import { TILE_WIDTH, TILE_HEIGHT, SCROLL_SPEED } from '../common/Const';

// FiveNations namespace to fetch the game window dimensions
const ns = window.fivenations;

// refresh rate skipped execution per tick
const FOG_OF_WAR_REFRESH_RATE = 5;

// refresh rate skipped execution per tick
// Entities are not moving rapidly so we won't have to update
// the collision map obsessively
const COLLISION_MAP_REFRESH_RATE = 10;

const MIN_WIDTH = 32;
const MIN_HEIGHT = 32;

let width = MIN_WIDTH * TILE_WIDTH;
let height = MIN_HEIGHT * TILE_HEIGHT;

let game;

let starfield;
let fogOfWar;
let fogOfWarRenderer;
let collisionMap;
let dirty = true; // true for the first render

class Map {
  constructor(_game) {
    this.initGame(_game);
    this.exposeStarfield();
    this.calculateScreenDimensionInTiles();
  }

  initGame(_game) {
    game = _game;
    game.stage.backgroundColor = '#000';
  }

  exposeStarfield() {
    this.Starfield = Starfield;
  }

  calculateScreenDimensionInTiles() {
    this.screenTileWidth = Math.floor(ns.window.width / 40);
    this.screenTileHeight = Math.floor(ns.window.height / 40);
  }

  new(config) {
    this.setSize(config);
    this.initLayers(config);
  }

  setSize(config) {
    width = config.width;
    height = config.height;
    game.world.setBounds(0, 0, this.getScreenWidth(), this.getScreenHeight());
  }

  initLayers(config) {
    // initializes the separate layers
    starfield = new Starfield(this, config.starfield);
    fogOfWar = new FogOfWar(this);
    fogOfWarRenderer = new FogOfWarRenderer(fogOfWar);
    collisionMap = new CollisionMap(this);

    // generates a function for updating the FogOfWar fields
    // only at the given regular intervals so that to improve performance
    fogOfWar.optimizedUpdate = Util.interval(
      (entityManager) => {
        fogOfWar.update(entityManager);
        if (fogOfWar.isDirty()) {
          dirty = true;
        }
      },
      FOG_OF_WAR_REFRESH_RATE,
      fogOfWar,
    );

    // generates a function for updating the CollisionMap tiles
    // only at the given regular intervals so that to improve performance
    collisionMap.optimizedUpdate = Util.interval(
      (entityManager) => {
        collisionMap.update(entityManager);
      },
      COLLISION_MAP_REFRESH_RATE,
      collisionMap,
    );
  }

  update(entityManager) {
    if (starfield) starfield.update();
    if (fogOfWar) {
      fogOfWar.optimizedUpdate(entityManager);
      if (dirty) {
        fogOfWarRenderer.update();
        dirty = false;
      }
    }
    if (collisionMap) {
      collisionMap.optimizedUpdate(entityManager);
      if (ns.debugMode) {
        collisionMap.debug(entityManager);
      }
    }
  }

  scrollTo(x, y) {
    game.camera.x = x;
    game.camera.y = y;
    dirty = true;
  }

  scrollToTile(x, y) {
    this.scrollTo(x * TILE_WIDTH, y * TILE_HEIGHT);
  }

  scrollLeft(extent) {
    game.camera.x -= extent || SCROLL_SPEED;
    dirty = true;
  }

  scrollRight(extent) {
    game.camera.x += extent || SCROLL_SPEED;
    dirty = true;
  }

  scrollUp(extent) {
    game.camera.y -= extent || SCROLL_SPEED;
    dirty = true;
  }

  scrollDown(extent) {
    game.camera.y += extent || SCROLL_SPEED;
    dirty = true;
  }

  getScreenWidth() {
    return TILE_WIDTH * width;
  }

  getScreenHeight() {
    return TILE_HEIGHT * height;
  }

  getWidth() {
    return width;
  }

  getHeight() {
    return height;
  }

  getTileWidth() {
    return TILE_WIDTH;
  }

  getTileHeight() {
    return TILE_HEIGHT;
  }

  getFogOfWar() {
    return fogOfWar;
  }

  getFogOfWarRenderer() {
    return fogOfWarRenderer;
  }

  getCollisionMap() {
    return collisionMap;
  }

  getGame() {
    return game;
  }

  getStarfield() {
    return starfield;
  }

  isDirty() {
    return dirty;
  }

  /**
   * Returns whether the tile identified by the given coordinates is
   * on or off the screen
   * @param {number} x
   * @param {number} y
   */
  isTileOnScreen(x, y) {
    const screenX = Math.floor(game.camera.x / 40);
    const screenY = Math.floor(game.camera.y / 40);
    return (
      x >= screenX &&
      y >= screenY &&
      x <= screenX + this.screenTileWidth &&
      y <= screenY + this.screenTileHeight
    );
  }

  forceRefresh() {
    dirty = true;
  }
}

export default Map;
