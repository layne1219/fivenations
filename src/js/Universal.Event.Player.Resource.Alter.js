define('Universal.Event.Player.Resource.Alter', [
    'Universal.Event',
    'PlayerManager'
], function(Event, PlayerManager) {

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
        if (!options.data || !options.data.guid) throw 'Invalid data attribute!';

        var player = PlayerManager.getInstane().getPlayerByGUID(optiosn.data.guid);

        if (options.data.titanium) player.setTitanium(options.data.titanium);
        if (options.data.silicium) player.setSilicium(options.data.silicium);
        if (options.data.energy) player.setEnergy(options.data.energy);
        if (options.data.uranium) player.setUranium(options.data.uranium);
    };

    return PlayerResourceAlter;

});