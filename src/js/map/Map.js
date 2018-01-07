/* eslint prefer-destructuring: 0 */
/* eslint class-methods-use-this: 0 */
import Starfield from '../starfield/Starfield';
import FogOfWar from './FogOfWar';
import FogOfWarRenderer from './FogOfWarRenderer';
import CollisionMap from './CollisionMap';
import Util from '../common/Util';

// refresh rate skipped execution per tick
const FOG_OF_WAR_REFRESH_RATE = 5;

// refresh rate skipped execution per tick
// Entities are not moving rapidly so we won't have to update
// the collision map obsessively
const COLLISION_MAP_REFRESH_RATE = 100;

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
let collisionMap;
let fogOfWarDirty = false;

class Map {
  constructor(_game) {
    this.initGame(_game);
    this.exposeStarfield();
  }

  initGame(_game) {
    game = _game;
    game.stage.backgroundColor = '#000';
  }

  exposeStarfield() {
    this.Starfield = Starfield;
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
        fogOfWarDirty = true;
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
      if (fogOfWarDirty) {
        fogOfWarRenderer.update();
        fogOfWarDirty = false;
      }
    }
    if (collisionMap) {
      collisionMap.optimizedUpdate(entityManager);
    }
  }

  scrollTo(x, y) {
    game.camera.x = x;
    game.camera.y = y;
    fogOfWarDirty = true;
  }

  scrollToTile(x, y) {
    this.scrollTo(x * TILE_WIDTH, y * TILE_HEIGHT);
  }

  scrollLeft(extent) {
    game.camera.x -= extent || SCROLL_SPEED;
    fogOfWarDirty = true;
  }

  scrollRight(extent) {
    game.camera.x += extent || SCROLL_SPEED;
    fogOfWarDirty = true;
  }

  scrollUp(extent) {
    game.camera.y -= extent || SCROLL_SPEED;
    fogOfWarDirty = true;
  }

  scrollDown(extent) {
    game.camera.y += extent || SCROLL_SPEED;
    fogOfWarDirty = true;
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

  getCollisionMap() {
    return collisionMap;
  }

  getGame() {
    return game;
  }
}

export default Map;
