define('Universal.Event.Player.Create', [
    'Universal.Event'
], function(Event) {

    var ns = window.fivenations;

    function UniversalEventPlayerCreate() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventPlayerCreate.prototype = Object.create(Event.prototype);
    UniversalEventPlayerCreate.prototype.constructor = UniversalEventPlayerCreate;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     */
    UniversalEventPlayerCreate.prototype.execute = function(options) {
        if (!options.data) return;
        
    };

    return UniversalEventPlayerCreate;

});