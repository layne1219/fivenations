import Util from '../common/Util';

function create(map) {

    if (!map) throw 'Invalid Map instance!';

    const tiles = Util.matrix(map.getWidth(), map.getHeight());
    const tileWidth = map.getTileWidth();

    return {

        visit: function(x, y) {
            if (x > 0 && y > 0 && y < tiles.length && x < tiles[0].length) {
                tiles[y][x] = 1;
            }
            return this;
        },

        visitTilesByEntityVisibility: function(entity) {
            var vision = entity.getDataObject().getVision();
            var tileVision = Math.max(Math.round(vision / tileWidth), 1);
            var tile = entity.getTile(map);

            if (tileVision === 1) {
                this.visit(tile[0], tile[1]);
            } else {
                for (var i = 0; i < tileVision; i += 1) {
                    for (var j = 0; j < tileVision; j += 1) {
                        this.visit(tile[0] - Math.floor(i / 2) + i, tile[0] - Math.floor(j / 2) + j);
                    }
                }                   
            }
        },

        isVisible: function(x, y) {
            if (x > 0 && y > 0 && y < tiles.length && x < tiles[0].length) {
                return tiles[y][x];
            } else {
                return false;
            }
        },

        update: function(entityManager) {
            entityManager
                .entities(':user')
                .forEach(entity => this.visitTilesByEntityVisibility(entity));
        },

        getMatrix: function() {
            return tiles;
        }                    

    };

}

export default {
    create
};
