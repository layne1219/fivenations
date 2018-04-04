/* global Phaser, window */
import EasyStar from 'easystarjs';
import Util from '../common/Util';
import { TILE_WIDTH, TILE_HEIGHT } from '../common/Const';

const ns = window.fivenations;

// aggregation of tile ids that are considered as no-wall
const ACCEPTABLE_TILES = [0];

// various types of obstacles
const OBSTACLE_BUILDING = 0;
const OBSTACLE_ENTITY = 1;
const OBSTACLE_SPACE_OBJECT = 2;

/**
 * Returns an object that contains collision informations for
 * the specified tile it has been attached to
 * @param {object} entity - Entity
 * @return {object}
 */
function getCollisionTileDataByEntity(entity) {
  const dataObject = entity.getDataObject();
  let type = OBSTACLE_ENTITY;
  if (dataObject.isSpaceObject()) {
    type = OBSTACLE_SPACE_OBJECT;
  } else if (dataObject.isBuilding()) {
    type = OBSTACLE_BUILDING;
  }
  return type;
}

/**
 * Returns if the given tile is deemed as obstacle for the given entity
 * @param {object} tile - tile data (see getCollisionTileDataByEntity)
 * @param {object} entity - Entity
 */
function isTileOccupiedForEntity(tile, entity) {
  const dataObject = entity.getDataObject();
  // if the entity is a Destroyer it can go through all obstacles
  // apart from Space Objects
  if (dataObject.isDestroyer()) {
    return tile === OBSTACLE_SPACE_OBJECT;
  }
  return true;
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
    this.easyStar.enableDiagonals();
    // refresh the grid when the collision map changes
    this.on('change', tiles => this.easyStar.setGrid(tiles));
  }

  /**
   * Returns a Promise that is resolved when the built-n EasyStar
   * library finishes with the calculation of the shortest path between
   * the two given coordinates.
   * @param {object} start - { x, y }
   * @param {object} dest - { x, y }
   * @return {Promise}
   */
  calculatePath(start, dest) {
    return new Promise((resolve) => {
      this.easyStar.findPath(start.x, start.y, dest.x, dest.y, resolve);
    });
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
    const tile = previous ? this.getPreviousTile(entity) : entity.getTile();
    if (!tile) return this;

    const [x, y] = tile;
    const {
      width, height, offsetX, offsetY,
    } = entity.getCollisionData();

    for (let i = width - 1; i >= 0; i -= 1) {
      for (let j = height - 1; j >= 0; j -= 1) {
        const tileX = Math.min(
          Math.max(x - offsetX + i, 0),
          this.tiles[0].length,
        );
        const tileY = Math.min(Math.max(y - offsetY + j, 0), this.tiles.length);
        // when unsetting the previous tile
        if (previous) {
          // if it's belonged to the given entity only
          this.tiles[tileY][tileX] = 0;
        } else {
          const data = getCollisionTileDataByEntity(entity);
          this.tiles[tileY][tileX] = data;
        }
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
    // update the entity collision state only if it has moved since the
    // previously executed check
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
   * Updates collision tiles according to the positions of the
   * passed aggregation of entities
   * @param {object} Entity[]
   */
  visitTilesByEntities(entities) {
    entities.forEach(entity => this.visitTilesByEntity(entity));
  }

  /**
   * Updates the obstacle flag (that shows whether there is an obstacle
   * ahead of a given entity) for the given entity.
   * @param {object} entity - Entity
   */
  updateObstaclesForEntity(entity) {
    // at every tick we assume that the entity is unblocked
    entity.setObstacleAhead(false);

    if (this.isObstacleAheadForEntity(entity)) {
      // flags the entity as blocked. It will be used by
      // the corresponding Activity Manager to make the actual
      // activity interrupted if need be
      entity.setObstacleAhead(true);
    }
  }

  /**
   * Updates the obstacle flag (that shows whether there is an obstacle
   * ahead of a given entity) for all entities.
   * @param {object} entities - Entity[]
   */
  updateObstaclesForEntities(entities) {
    entities.forEach(entity => this.updateObstaclesForEntity(entity));
  }

  /**
   * Loops through all active entities and sets the occupiation of
   * the collision map accordingly
   * @param {object} EntityManager - instance of EntityManager
   */
  update(entityManager) {
    this.setDirtyFlag(false);

    const entities = entityManager
      .entities(':not(hibernated)')
      .filter(entity => !entity.getDataObject().isFighter());

    this.visitTilesByEntities(entities);
    // if the map has been altered since the last check
    // we execute all the registered listeners
    if (this.isDirty()) {
      // we don't care about if buildings are blocked
      const nonBuildings = entities.filter(entity => !entity.getDataObject().isBuilding());
      // if the collision tiles have changed we've got to
      // update which entity is now blocked
      this.updateObstaclesForEntities(nonBuildings);
      // for listeners
      this.dispatcher.dispatch('change', this.tiles);
    }
  }

  /**
   * Calculates the paths on every tick
   */
  calculateEasyStarPaths() {
    this.easyStar.calculate();
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
          const width = TILE_WIDTH;
          const height = TILE_HEIGHT;
          const x = j * width;
          const y = i * height;
          const rect = new Phaser.Rectangle(x, y, width, height);
          const color = '#fa0000';
          phaserGame.debug.geom(rect, color, false);
        }
      }
    }

    // shows the tile where the leading collision point is located
    entityManager.entities(':not(hibernated)').forEach((entity) => {
      const tiles = entity.getTilesAhead();
      const width = TILE_WIDTH;
      const height = TILE_HEIGHT;

      tiles.forEach((tile) => {
        const x = tile.x * width;
        const y = tile.y * height;
        const rect = new Phaser.Rectangle(x, y, width, height);
        phaserGame.debug.geom(rect, '#ffac00', false);
      });

      const pathTiles = entity.getTilesToTarget();
      if (pathTiles) {
        pathTiles.forEach((tile) => {
          const x = tile.x * width;
          const y = tile.y * height;
          const rect = new Phaser.Rectangle(x, y, width, height);
          phaserGame.debug.geom(rect, '#00ab00', false);
        });
      }
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
   * Fetches a tile identified by the given coordinets and
   * returns whether it is occupied or not based on the type
   * of the occupation and the entity
   * @param {object} coords - horizontal and vertical offsets
   * @param {object} entity - Entity
   * @return {boolean} true if the tile is occupied
   */
  isOccupiedForEntity(coords, entity) {
    const { x, y } = coords;
    if (x >= 0 && y >= 0 && y < this.tiles.length && x < this.tiles[0].length) {
      const tile = this.tiles[y][x];
      if (!tile) {
        return false;
      }
      return isTileOccupiedForEntity(tile, entity);
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

  /**
   * Returns whether the entity has an obstacle ahead according to
   * its current heading
   * @param {entity}
   * @return {boolean}
   */
  isObstacleAheadForEntity(entity) {
    // Fighter class entities can go through anything
    if (entity.getDataObject().isFighter()) return false;
    // get the array of tiles ahead
    const tilesAhead = entity.getTilesAhead();
    return tilesAhead.some(tile => this.isOccupiedForEntity(tile, entity));
  }
}

export default CollisionMap;
