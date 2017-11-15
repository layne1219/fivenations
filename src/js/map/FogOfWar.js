import Util from '../common/Util';
import FogOfWarMasks from './FogOfWarMasks';

class FogOfWar {

    constructor(map) {
        this.initMatrix(map);
    }

    initMatrix(map) {
        this.tiles = Util.matrix(map.getWidth(), map.getHeight());
        this.tileWidth = map.getTileWidth();
        this.map = map;
    }

    visit(x, y) {
        if (x > 0 && y > 0 && y < this.tiles.length && x < this.tiles[0].length) {
            this.tiles[y][x] = 1;
        }
        return this;
    }

    visitTilesByEntityVisibility(entity) {
        var vision = Math.max(entity.getDataObject().getVision(), 1);
        var mask = FogOfWarMasks.getMaskBySize(vision);
        var offset = Math.floor(mask.length / 2);
        var tile = entity.getTile(this.map);

        for (var i = 0; i < mask.length; i += 1) {
            for (var j = 0; j < mask[i].length; j += 1) {
                if (mask[i][j]) {
                    this.visit(tile[0] - offset + j, tile[1] - offset + i);
                }
            }
        }                   
    }

    isVisible(x, y) {
        if (x > 0 && y > 0 && y < this.tiles.length && x < this.tiles[0].length) {
            return this.tiles[y][x];
        } else {
            return false;
        }
    }

    update(entityManager) {
        entityManager
            .entities(':user')
            .forEach(entity => this.visitTilesByEntityVisibility(entity));
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
        return this.tiles.map(rows => {
            return rows.filter((column, idx) => {
                return idx >= chunk.x && idx < chunk.x + chunk.width;
            });
        })
        .filter((rows, idx) => {
            return idx >= chunk.y && idx < chunk.y + chunk.height;
        });
    }

    /** 
     * Returns the map instance 
     * @return {object}
     */
    getMap() {
        return this.map;
    }

}

export { FogOfWar };
export default FogOfWar;
