import Util from '../common/Util';
import FogOfWarMasks from './FogOfWarMasks';

const FAKE_ROW = [];
const FAKE_VALUE = 0;

function addFakeRows(map) {
  for (let i = map.getWidth() - 1; i >= 0; i -= 1) {
    FAKE_ROW.push(FAKE_VALUE);
  }
}

class FogOfWar {
  constructor(map) {
    this.initMatrix(map);
    addFakeRows(map);
  }

  initMatrix(map) {
    this.tiles = Util.matrix(map.getWidth(), map.getHeight());
    this.tileWidth = map.getTileWidth();
    this.map = map;
  }

  visit(x, y) {
    if (x >= 0 && y >= 0 && y < this.tiles.length && x < this.tiles[0].length) {
      this.tiles[y][x] = 1;
    }
    return this;
  }

  visitTilesByEntityVisibility(entity) {
    const vision = Math.max(entity.getDataObject().getVision(), 1);
    const mask = FogOfWarMasks.getMaskBySize(vision);
    const offset = Math.floor(mask.length / 2);
    const tile = entity.getTile(this.map);

    for (let i = 0; i < mask.length; i += 1) {
      for (let j = 0; j < mask[i].length; j += 1) {
        if (mask[i][j]) {
          this.visit(-offset + tile[0] + j, -offset + tile[1] + i);
        }
      }
    }
  }

  isVisible(x, y) {
    if (x >= 0 && y >= 0 && y < this.tiles.length && x < this.tiles[0].length) {
      return this.tiles[y][x];
    }
    return false;
  }

  update(entityManager) {
    entityManager.entities(':user').forEach(entity => this.visitTilesByEntityVisibility(entity));
  }

  getMatrix() {
    return this.tiles;
  }

  /**
   * Returns a chunk of the complete matrix according to the given parameter object
   * @param {object} chunk - chunk.x, chunk.y, chunk.width, chunk.height
   * @return {array} two dimensional array of the requested chunk
   */
  getMatrixChunk(chunk) {
    const tmpArray = Util.deepClone(this.tiles);
    if (chunk.y === -1) {
      tmpArray.unshift(FAKE_ROW);
    }
    if (chunk.height >= tmpArray.length) {
      tmpArray.push(FAKE_ROW);
    }
    if (chunk.width >= tmpArray[0].length) {
      tmpArray.map(row => row.push(FAKE_VALUE));
    }
    if (chunk.x === -1) {
      tmpArray.map(row => row.unshift(FAKE_VALUE));
    }
    return tmpArray
      .map(rows => rows.filter((column, idx) => idx >= chunk.x && idx < chunk.x + chunk.width))
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

export default FogOfWar;
