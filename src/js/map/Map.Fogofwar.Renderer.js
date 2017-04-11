define('Map.Fogofwar.Renderer', function(){

    var ns = window.fivenations,

        create = function (map){

            if (!map) throw 'Invalid Map instance!';

            var width = Math.floor(ns.window.width / map.getTileWidth());
            var height = Math.floor(ns.window.height / map.getTileHeight());

            return {
                width: width,
                height: height
            };

        }

    return {
        create: create
    };

});