define('Universal.Event.Entity.Damage', ['Universal.Event'], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEntityDamage() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityDamage.prototype = Object.create(Event.prototype);
    UniversalEventEntityDamage.prototype.constructor = UniversalEventEntityDamage;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     * @example
     */
    UniversalEventEntityDamage.prototype.execute = function(options) {
        if (!options.targets || !options.data) {
            return;
        }
        options.targets.forEach(function(id) {
            var entity = ns.game.entityManager.entities(id);
            entity.damage(options.data);
        });
    };

    return UniversalEventEntityDamage;

});