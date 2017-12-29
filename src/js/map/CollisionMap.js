import Util from '../common/Util';

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
   * Sets the specified tile according to the given coordinates as
   * occupied by an entity
   * @param {number} x - horizontal offset
   * @param {number} y - vertical offset
   * @return {object} this
   */
  visit(x, y) {
    if (x >= 0 && y >= 0 && y < this.tiles.length && x < this.tiles[0].length) {
      this.tiles[y][x] = 1;
    }
    return this;
  }

  /**
   * Sets the specified tile according to the given coordinates as
   * empty
   * @param {number} x - horizontal offset
   * @param {number} y - vertical offset
   * @return {object} this
   */
  unvisit(x, y) {
    if (x >= 0 && y >= 0 && y < this.tiles.length && x < this.tiles[0].length) {
      this.tiles[y][x] = 0;
    }
    return this;
  }

  /**
   * Sets the tile identified by the given entity location as
   * occupied
   * @param {object} entity - Entity instance
   */
  visitTilesByEntity(entity) {
    const tile = entity.getTile(this.map);
    this.visit(tile[0], tile[1]);
  }

  /**
   * Unsets the tile identified by the given entity location as
   * occupied and therefore it is goint to be empty again
   * @param {object} entity - Entity instance
   */
  unvisitTilesByEntity(entity) {
    const tile = entity.getTile(this.map);
    this.visit(tile[0], tile[1]);
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
   * Loops through all active entities and sets the occupiation of
   * the collision map accordingly
   * @param {object} EntityManager - instance of EntityManager
   */
  update(entityManager) {
    entityManager
      .entities(':not(hibernated)')
      .forEach(entity => this.visitTilesByEntity(entity));
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
}

export default CollisionMap;
