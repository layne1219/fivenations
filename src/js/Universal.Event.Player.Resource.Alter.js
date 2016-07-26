define('Universal.Event.Player.Resource.Alter', [
    'Universal.Event'
], function(Event) {

    var ns = window.fivenations;

    function PlayerResourceAlter() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    PlayerResourceAlter.prototype = Object.create(Event.prototype);
    PlayerResourceAlter.prototype.constructor = PlayerResourceAlter;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     */
    PlayerResourceAlter.prototype.execute = function(options) {
        if (!options.data) return;
    };

    return PlayerResourceAlter;

});