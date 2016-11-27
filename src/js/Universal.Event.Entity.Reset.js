define('Universal.Event.Entity.Reset', ['Universal.Event'], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEntityReset() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityReset.prototype = Object.create(Event.prototype);
    UniversalEventEntityReset.prototype.constructor = UniversalEventEntityReset;

    /**
     * Executes the event against the specified entity
     */
    UniversalEventEntityReset.prototype.execute = function(options) {
        if (!options.targets) {
            return;
        }
        options.targets.forEach(function(id) {
            ns.game.entityManager
                .entities(id)
                .single()
                .reset();
        });
    };

    return UniversalEventEntityReset;

});