define('Universal.Event.Effect.Remove', [
    'Universal.Event'
], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEffectRemove() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEffectRemove.prototype = Object.create(Event.prototype);
    UniversalEventEffectRemove.prototype.constructor = UniversalEventEffectRemove;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     */
    UniversalEventEffectRemove.prototype.execute = function(options) {
        var config;

        if (!options.data) {
            return;
        }

        config = options.data;
        config.guid.forEach(function(guid) {
            var effect = ns.game.effectManager.getEffectByGUID(guid);
            if (!effect) return;
            ns.game.effectManager.remove(effect);    
        });
        
    };

    return UniversalEventEffectRemove;

});