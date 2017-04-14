import Event from './Event';
import PlayerManager from '../players/PlayerManager';

const ns = window.fivenations;

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

    var player = PlayerManager.getInstance().getPlayerByGUID(options.data.guid);

    if (options.data.titanium) player.setTitanium(options.data.titanium);
    if (options.data.silicium) player.setSilicium(options.data.silicium);
    if (options.data.energy) player.setEnergy(options.data.energy);
    if (options.data.uranium) player.setUranium(options.data.uranium);

    ns.game.signals.onResourcesUpdate.dispatch(options);
    if (player.isControlledByUser()) {
        ns.game.signals.onPlayerResourcesUpdate.dispatch();
    }        
};

export default PlayerResourceAlter;
