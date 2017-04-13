import Event from './Event';
const ns = window.fivenations;

function EntityDamage() {
    var args = [].slice.call(arguments);
    Event.apply(this, args);
}

EntityDamage.prototype = Object.create(Event.prototype);
EntityDamage.prototype.constructor = EntityDamage;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 */
EntityDamage.prototype.execute = function(options) {
    if (!options.targets || !options.data) {
        return;
    }
    options.targets.forEach(function(id) {
        var entity = ns.game.entityManager.entities(id);
        
        if (!entity) return;

        entity.damage(options.data);
    });
};

return EntityDamage;
