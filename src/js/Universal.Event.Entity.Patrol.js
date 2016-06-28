define('Universal.Event.Entity.Patrol', ['Universal.Event'], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEntityPatrol() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityPatrol.prototype = Object.create(Event.prototype);
    UniversalEventEntityPatrol.prototype.constructor = UniversalEventEntityPatrol;

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
    UniversalEventEntityPatrol.prototype.execute = function(options) {
        if (!options.targets || !options.data) {
            return;
        }
        var x = options.data.x,
            y = options.data.y;

        options.targets.forEach(function(id) {
            ns.game.entityManager.entitities(id).single().patrol(x, y);
        });
    };

    return UniversalEventEntityPatrol;

});