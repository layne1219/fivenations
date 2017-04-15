import Event from './Event';
const ns = window.fivenations;

function Place() {
    var args = [].slice.call(arguments);
    Event.apply(this, args);
}

Place.prototype = Object.create(Event.prototype);
Place.prototype.constructor = Place;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 * Expected Data format:
 * {
 * 	id: 'entity/Place'
 * 	targets: [124, 84],
 * 	data: [
 * 		{x: 156, y:367},
 * 		{x: 179, y:380}
 * 	]
 * }
 */
Place.prototype.execute = function(options) {
    if (!options.targets || !options.data) {
        return;
    }
    options.targets.forEach(function(id) {
        var entity = ns.game.entityManager.entities(id);
        var sprite = entity.getSprite();
        var x = options.data.x;
        var y = options.data.y;

        entity.reset();  
        entity.getMotionManager().reset();  

        sprite.x = x;
        sprite.y = y;
    });
};

export default Place;
