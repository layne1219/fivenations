define('Universal.Event.Entity.Follow', ['Universal.Event'], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEntityFollow() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityFollow.prototype = Object.create(Event.prototype);
    UniversalEventEntityFollow.prototype.constructor = UniversalEventEntityFollow;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     * @example
     */
    UniversalEventEntityFollow.prototype.execute = function(options) {
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

    return UniversalEventEntityFollow;

});