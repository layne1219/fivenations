import Event from './Event';
const ns = window.fivenations;

function EntityFollow() {
    var args = [].slice.call(arguments);
    Event.apply(this, args);
}

EntityFollow.prototype = Object.create(Event.prototype);
EntityFollow.prototype.constructor = EntityFollow;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 */
EntityFollow.prototype.execute = function(options) {
    if (!options.targets || !options.data) {
        return;
    }
    options.targets.forEach(function(id) {
        var targetEntity = ns.game.entityManager.entities(options.data.targetEntity);
        var entity = ns.game.entityManager.entities(id);
        if (options.resetActivityQueue) {
            entity.reset();    
        }
        entity.follow(targetEntity);
    });
};

export default EntityFollow;
