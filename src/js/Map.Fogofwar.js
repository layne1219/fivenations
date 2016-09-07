define('Map.Fogofwar', ['Util'], function(Util) {

    var create = function (map) {

        if (!map) throw 'Invalid Map instance!';

        var tiles = Util.matrix(map.getWidth(), map.getHeight());

        return {

            visit: function(x, y) {
                tiles[y][x] = 1;
                return this;
            },

            isVisible: function(x, y) {
                return tiles[y][x];
            },

            getMatrix: function() {
                return tiles;
            },

            update: function(entityManager) {
                entityManager.entities(':user').raw().forEach(function(entity){
                    var tile = entity.getTile(map);
                    this.visit(tile[0], tile[1]);
                }.bind(this));
            }            

        };

    }

    return {
        create: create
    };
    
});