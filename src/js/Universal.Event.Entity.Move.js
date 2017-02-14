define('Universal.Event.Entity.Move', ['Universal.Event'], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEntityMove() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityMove.prototype = Object.create(Event.prototype);
    UniversalEventEntityMove.prototype.constructor = UniversalEventEntityMove;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     * @example
     * Expected Data format:
     * {
     * 	id: 'entity/move'
     * 	targets: [124, 84],
     * 	data: [
     * 		{x: 156, y:367},
     * 		{x: 179, y:380}
     * 	]
     * }
     */
    UniversalEventEntityMove.prototype.execute = function(options) {
        if (!options.targets || !options.data) {
            return;
        }
        var x, y;

        options.targets.forEach(function(id, idx) {
            var entity = ns.game.entityManager.entities(id);
            x = options.data.x || options.data[idx].x;
            y = options.data.y || options.data[idx].y;

            if (options.resetActivityQueue) {
                entity.reset();    
            }

            entity.moveTo(x, y);
        });
    };

    return UniversalEventEntityMove;

});