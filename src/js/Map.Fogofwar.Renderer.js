define('Map.Fogofwar.Renderer', function(){

    var ns = window.fivenations,

        matrix = function(cols, rows){
            var arr = [];
            for (var i = 0; i < rows; i += 1){
                var columns = [];
                for (var j = 0; j < cols; j += 1){
                    columns[j] = 0;
                }
                arr[i] = columns;
            }
            return arr;
        },

    
        create = function (map){

            if (!map) throw 'Invalid Map instance!';

            var width = Math.floor(ns.window.width / map.getTileWidth()),
                height = Math.floor(ns.window.height / map.getTileHeight());

            return {
            };

        }

    return {
        create: create
    };

});