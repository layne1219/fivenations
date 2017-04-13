import Event from './Event';
const ns = window.fivenations;

function EntityPatrol() {
    var args = [].slice.call(arguments);
    Event.apply(this, args);
}

EntityPatrol.prototype = Object.create(Event.prototype);
EntityPatrol.prototype.constructor = EntityPatrol;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 * Expected Data format:
 * {
 *  id: 'entity/patrol'
 *  targets: [124, 84],
 *  data: [
 *      {x: 156, y:367}
 *  ]
 * }
 */
EntityPatrol.prototype.execute = function(options) {
    if (!options.targets || !options.data) {
        return;
    }
    var x = options.data.x,
        y = options.data.y;

    options.targets.forEach(function(id) {
        var entity = ns.game.entityManager.entities(id);

        if (options.resetActivityQueue) {
            entity.entities(id).reset();    
        }

        entity.patrol(x, y);
    });
};

export default EntityPatrol;
