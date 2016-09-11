define('Map.Fogofwar.Renderer', ['Util'], function(Util){

    var ns = window.fivenations,

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