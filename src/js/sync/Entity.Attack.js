import Event from './Event';
const ns = window.fivenations;

function EntityAttack() {
    var args = [].slice.call(arguments);
    Event.apply(this, args);
}

EntityAttack.prototype = Object.create(Event.prototype);
EntityAttack.prototype.constructor = EntityAttack;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 */
EntityAttack.prototype.execute = function(options) {
    if (!options.targets || !options.data) {
        return;
    }
    options.targets.forEach(function(id) {
        var targetEntity = ns.game.entityManager.entities(options.data.targetEntity);
        var entity = ns.game.entityManager.entities(id);
        if (options.resetActivityQueue) {
            entity.reset();    
        }
        entity.attack(targetEntity);
    });
};

export default EntityAttack;
