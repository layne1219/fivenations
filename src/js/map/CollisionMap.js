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
 * Returns details about the dimensions that the given entity
 * might occupy
 * @return {object} width, height, offsetX, offsetY
 */
function getEntityDimensionsForVisitingTiles(entity) {
  const sprite = entity.getSprite();
  const width = Math.max(
    Math.floor(sprite.hitArea.width / COLLISION_TILE_WIDTH),
    1,
  );
  const height = Math.max(
    Math.floor(sprite.hitArea.height / COLLISION_TILE_HEIGHT),
    1,
  );

  return {
    offsetX: Math.floor(width / 2),
    offsetY: Math.floor(height / 2),
    width,
    height,
  };
}

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
    // rainbow list to persist coordinates of previously occuped tiles
    // on entity bases
    this.previousCoords = {};
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
   * Sets the coordinates of the tile that the given entity
   * previously occuped
   * @param {object} entity - Entity
   * @param {object} coords - [x, y]
   */
  setPreviousTile(entity, coords) {
    this.previousCoords[entity.getGUID()] = coords || entity.getTile();
  }

  /**
   * Sets the specified tile according to the given coordinates as
   * occupied by an entity
   * @param {object} entity - Entity
   * @param {boolean} previous - if true it releases the occupation of
   * previous tiles
   * @return {object} this
   */
  visit(entity, previous = false) {
    const [x, y] = previous ? this.getPreviousTile(entity) : entity.getTile();
    const {
      width,
      height,
      offsetX,
      offsetY,
    } = getEntityDimensionsForVisitingTiles(entity);

    for (let i = width - 1; i >= 0; i -= 1) {
      for (let j = height - 1; j >= 0; j -= 1) {
        const tileX = Math.min(
          Math.max(x - offsetX + i, 0),
          this.tiles[0].length,
        );
        const tileY = Math.min(Math.max(y - offsetY + j, 0), this.tiles.length);
        this.tiles[tileY][tileX] = previous ? 0 : 1;
      }
    }

    if (!previous) {
      this.setPreviousTile(entity, [x, y]);
    }

    this.setDirtyFlag(true);

    return this;
  }

  /**
   * Shorthand function to visit previously occuped tiles by the given entity
   * @param {object} - entity
   */
  unvisitPrevious(entity) {
    this.visit(entity, true);
  }

  /**
   * Sets the collision tiles by given entity location
   * @param {object} entity - Entity instance
   */
  visitTilesByEntity(entity) {
    if (this.hasPreviousTile(entity)) {
      const hasMoved = this.hasEntityChangedOccupiedTiles(entity);
      if (hasMoved) {
        this.unvisitPrevious(entity);
        this.visit(entity);
      }
    } else {
      this.visit(entity);
    }
  }

  /**
   * Unsets the collision tiles by given entity location
   * @param {object} entity - Entity instance
   */
  unvisitTilesByEntity(entity) {
    this.unvisitPrevious(entity);
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
  debug(entityManager) {
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

    // shows the tile where the leading collision point is located
    entityManager.entities(':not(hibernated)').forEach((entity) => {
      const tiles = entity.getTilesAhead();
      const width = COLLISION_TILE_WIDTH;
      const height = COLLISION_TILE_HEIGHT;

      tiles.forEach((tile) => {
        const x = tile.x * width;
        const y = tile.y * height;
        const rect = new Phaser.Rectangle(x, y, width, height);
        phaserGame.debug.geom(rect, '#ffaa00', false);
      });
    });
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
   * Returns the coordinates of the tile that the given entity
   * previously occuped
   * @param {object} entity - Entity
   * @return {object} array - [x, y]
   */
  getPreviousTile(entity) {
    return this.previousCoords[entity.getGUID()];
  }

  /**
   * Returns if the entity has previous coordinates of occupation
   * @param {boolean} entity - Entity
   */
  hasPreviousTile(entity) {
    return !!this.previousCoords[entity.getGUID()];
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

  /**
   * Returns whether the given entity has changed its position and
   * therefore the collision tiles must be updated
   * @param {object} entity
   * @return {boolean}
   */
  hasEntityChangedOccupiedTiles(entity) {
    const previousTile = this.getPreviousTile(entity);
    const tile = entity.getTile();
    return !previousTile.every((v, idx) => tile[idx] === v);
  }
}

export default CollisionMap;
