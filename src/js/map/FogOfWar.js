import Util from '../common/Util';
import FogOfWarRenderer from './FogOfWarRenderer';

class FogOfWar {

    constructor(map) {
        this.initMatrix(map);
        this.initRenderer();
    }

    initMatrix(map) {
        this.tiles = Util.matrix(map.getWidth(), map.getHeight());
        this.tileWidth = map.getTileWidth();
        this.map = map;
    }

    initRenderer() {
        this.renderer = new FogOfWarRenderer(this);
    }

    visit(x, y) {
        if (x > 0 && y > 0 && y < this.tiles.length && x < this.tiles[0].length) {
            this.tiles[y][x] = 1;
        }
        return this;
    }

    visitTilesByEntityVisibility(entity) {
        var vision = entity.getDataObject().getVision();
        var tileVision = Math.max(Math.round(vision / this.tileWidth), 1);
        var tile = entity.getTile(this.map);

        if (tileVision === 1) {
            this.visit(tile[0], tile[1]);
        } else {
            for (var i = 0; i < tileVision; i += 1) {
                for (var j = 0; j < tileVision; j += 1) {
                    this.visit(tile[0] - Math.floor(i / 2) + i, tile[0] - Math.floor(j / 2) + j);
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
        
        if (this.renderer) {
            this.renderer.update();
        }
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

export {
    FogOfWar,
    FogOfWarRenderer
};
export default FogOfWar;
