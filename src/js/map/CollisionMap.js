/* global Phaser, window */
import EasyStar from 'easystarjs';
import Util from '../common/Util';

const ns = window.fivenations;

// aggregation of tile ids that are considered as no-wall
const ACCEPTABLE_TILES = [0];

// dimensions of one collision tile in pixels
const COLLISION_TILE_WIDTH = 40;
const COLLISION_TILE_HEIGHT = 40;

/**
 * Wraps a matrix that contains infomations about which map tile
 * is occupied by a given entity and exposes API calls to fetch
 * these datas in certain ways
 */
class CollisionMap {
  /**
   * Generates the collision matrix
   * @param {object} map - Map instance to initialise collision tiles
   */
  constructor(map) {
    this.initMatrix(map);
    this.initEventDispatcher();
    this.initEasyStar();
  }

  /**
   * Creates a matrix that holds data about which tile is occupied by
   * an entity
   * @param {object} map - Map instance to initialise collision tiles
   */
  initMatrix(map) {
    this.tiles = Util.matrix(map.getWidth(), map.getHeight());
    this.map = map;
  }

  /**
   * Creates a local event dispatcher
   */
  initEventDispatcher() {
    this.dispatcher = new Util.EventDispatcher();
  }

  /**
   * Initialises an EasyStar pathfinding instance
   */
  initEasyStar() {
    // eslint-disable-next-line new-cap
    this.easyStar = new EasyStar.js();
    // avoids easyStar to hold up the main thread by limiting the number of
    // calculations per iteration
    this.easyStar.setIterationsPerCalculation(1000);
    this.easyStar.setGrid(this.tiles);
    this.easyStar.setAcceptableTiles(ACCEPTABLE_TILES);
    // refresh the grid when the collision map changes
    this.on('change', tiles => this.easyStar.setGrid(tiles));
  }

  /**
   * Sets the specified tile according to the given coordinates as
   * occupied by an entity
   * @param {number} x - horizontal offset
   * @param {number} y - vertical offset
   * @param {number} value - 0 or 1
   * @param {number} width - number of tiles to visit horizontally
   * @param {number} height - number of tiles to visit vertically
   * @param {number} offsetX - horizontal offset
   * @param {number} offsetY - vertical offset
   * @return {object} this
   */
  visit(x, y, value = 1, width = 1, height = 1, offsetX = 0, offsetY = 0) {
    for (let i = width - 1; i >= 0; i -= 1) {
      for (let j = height - 1; j >= 0; j -= 1) {
        const tileX = Math.min(
          Math.max(x - offsetX + i, 0),
          this.tiles[0].length,
        );
        const tileY = Math.min(Math.max(y - offsetY + j, 0), this.tiles.length);
        this.tiles[tileY][tileX] = value;
      }
    }
    return this;
  }

  /**
   * Sets the tile identified by the given entity location as
   * occupied
   * @param {object} entity - Entity instance
   */
  visitTilesByEntity(entity) {
    // it's important to execute getPreviousTile first
    const previousTile = entity.getPreviousTile(this.map);
    const tile = entity.getTile(this.map);
    const sprite = entity.getSprite();
    const width = Math.floor(sprite.hitArea.width / COLLISION_TILE_WIDTH);
    const height = Math.floor(sprite.hitArea.height / COLLISION_TILE_HEIGHT);
    const offsetX = Math.floor(width / 2);
    const offsetY = Math.floor(height / 2);

    if (!previousTile) {
      this.visit(tile[0], tile[1], 1, width, height, offsetX, offsetY);
      return;
    }

    const sameCoords = previousTile.every((v, idx) => tile[idx] === v);
    if (!sameCoords) {
      this.visit(
        previousTile[0],
        previousTile[1],
        0,
        width,
        height,
        offsetX,
        offsetY,
      );
      this.visit(tile[0], tile[1], 1, width, height, offsetX, offsetY);
      this.setDirtyFlag(true);
    }
  }

  /**
   * Loops through all active entities and sets the occupiation of
   * the collision map accordingly
   * @param {object} EntityManager - instance of EntityManager
   */
  update(entityManager) {
    this.setDirtyFlag(false);

    entityManager
      .entities(':not(hibernated)')
      .forEach(entity => this.visitTilesByEntity(entity));

    // if the map has been altered since the last check
    // we execute all the registered listeners
    if (this.isDirty()) {
      this.dispatcher.dispatch('change', this.tiles);
    }
  }

  /**
   * Sets whether the map has changed since the last check
   * @param {boolean}
   */
  setDirtyFlag(flag) {
    this.dirty = flag;
  }

  /**
   * Registers external listeners against local events
   * @param {string} event
   * @param {function} listener
   */
  on(event, listener) {
    this.dispatcher.addEventListener(event, listener);
  }

  /**
   * Displays the occupied tiles on the screen for debugging purposes
   */
  debug() {
    const phaserGame = ns.game.game;
    for (let i = this.tiles.length - 1; i >= 0; i -= 1) {
      for (let j = this.tiles[i].length - 1; j >= 0; j -= 1) {
        if (this.tiles[i][j]) {
          const width = COLLISION_TILE_WIDTH;
          const height = COLLISION_TILE_HEIGHT;
          const x = j * width;
          const y = i * height;
          const rect = new Phaser.Rectangle(x, y, width, height);
          phaserGame.debug.geom(rect, '#fa0000', false);
        }
      }
    }
  }

  /**
   * Returns the whole collision map for external consuming code
   * @return {object} matrix of tiles
   */
  getMatrix() {
    return this.tiles;
  }

  /**
   * Returns a chunk of the complete matrix according to the given parameter object
   * @param {object} chunk - chunk.x, chunk.y, chunk.width, chunk.height
   * @return {array} two dimensional array of the requested chunk
   */
  getMatrixChunk(chunk) {
    return this.tiles
      .map(rows =>
        rows.filter((column, idx) => idx >= chunk.x && idx < chunk.x + chunk.width))
      .filter((rows, idx) => idx >= chunk.y && idx < chunk.y + chunk.height);
  }

  /**
   * Returns the map instance
   * @return {object}
   */
  getMap() {
    return this.map;
  }

  /**
   * Returns true if any of the tiles has been changed since the
   * last check
   * @return {boolean}
   */
  isDirty() {
    return this.dirty;
  }

  /**
   * Fetches a tile identified by the given coordinats and
   * returns whether it is occupied or not
   * @param {number} x - horizontal offset
   * @param {number} y - vertical offset
   * @return {boolean} true if the tile is occupied
   */
  isOccupied(x, y) {
    if (x >= 0 && y >= 0 && y < this.tiles.length && x < this.tiles[0].length) {
      return this.tiles[y][x];
    }
    return false;
  }
}

export default CollisionMap;
