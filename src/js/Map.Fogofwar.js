define('Map.Fogofwar', function() {

    var matrix = function(cols, rows){
        var arr = [];
        for (var i = 0; i < rows; i += 1){
            var columns = [];
            for (var j = 0; j < cols; j += 1){
                columns[j] = 0;
            }
            arr[i] = columns;
        }
        return arr;
    };
    
    var create = function (map){

        if (!map) throw 'Invalid Map instance!';

        var tiles = matrix(map.getWidth(), map.getHeight());

        return {

            visit: function(x, y) {
                tiles[y][x] = 1;
                return this;
            },

            isVisible: function(x, y) {
                return tiles[y][x];
            },

            update: function(entityManager){
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