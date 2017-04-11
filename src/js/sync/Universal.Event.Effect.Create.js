define('Universal.Event.Effect.Create', [
    'Universal.Event'
], function(Event) {

    var ns = window.fivenations;

    function UniversalEventEffectCreate() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEffectCreate.prototype = Object.create(Event.prototype);
    UniversalEventEffectCreate.prototype.constructor = UniversalEventEffectCreate;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     */
    UniversalEventEffectCreate.prototype.execute = function(options) {
        var config;

        if (!options.data) {
            return;
        }

        config = options.data;
        ns.game.effectManager.add(config);
    };

    return UniversalEventEffectCreate;

});