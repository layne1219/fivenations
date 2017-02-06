define('Universal.Event.Entity.Attack', ['Universal.Event'], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEntityAttack() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityAttack.prototype = Object.create(Event.prototype);
    UniversalEventEntityAttack.prototype.constructor = UniversalEventEntityAttack;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     * @example
     */
    UniversalEventEntityAttack.prototype.execute = function(options) {
        if (!options.targets || !options.data) {
            return;
        }
        options.targets.forEach(function(id) {
            var targetEntity = options.data.targetEntity;
            ns.game.entityManager.entities(id).attack(targetEntity);
        });
    };

    return UniversalEventEntityAttack;

});