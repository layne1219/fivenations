define('Map.Fogofwar', ['Util'], function(Util) {

    var create = function (map) {

        if (!map) throw 'Invalid Map instance!';

        var tiles = Util.matrix(map.getWidth(), map.getHeight()),
            tileWidth = map.getWidth();

        return {

            visit: function(x, y) {
                tiles[y][x] = 1;
                return this;
            },

            visitTilesByEntityVisibility: function(entity) {
                var vision = entity.getDataObject().getVision(),
                    tileVision = Math.max(Math.round(vision / tileWidth), 1),
                    tile = entity.getTile(map);

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
                return tiles[y][x];
            },

            getMatrix: function() {
                return tiles;
            },

            update: function(entityManager) {
                entityManager.entities(':user').raw().forEach(function(entity){
                    this.visitTilesByEntityVisibility(entity);
                }.bind(this));
            }            

        };

    }

    return {
        create: create
    };
    
});