define('Universal.Event.Entity.Remove', [
    'Universal.Event'
], function(Event){
    
    var ns = window.fivenations;

    function UniversalEventEntityRemove(){
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityRemove.prototype = Object.create(Event.prototype);
    UniversalEventEntityRemove.prototype.constructor = UniversalEventEntityRemove;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     */
    UniversalEventEntityRemove.prototype.execute = function(options){
        if (!options.data){
            return;
        }

        entity = ns.game.entityManager.entities(options.data.id);
        ns.game.entityManager.remove(entity);

    };

    return UniversalEventEntityRemove;

});