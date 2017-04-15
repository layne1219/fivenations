const ns = window.fivenations;

function create(map) {

    if (!map) throw 'Invalid Map instance!';

    var width = Math.floor(ns.window.width / map.getTileWidth());
    var height = Math.floor(ns.window.height / map.getTileHeight());

    return {
        width: width,
        height: height
    };

}

export default {
    create
};
