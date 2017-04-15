import Event from './Event';
import PlayerManager from '../players/PlayerManager';

function UniversalEventPlayerCreate() {
    var args = [].slice.call(arguments);
    Event.apply(this, args);
}

UniversalEventPlayerCreate.prototype = Object.create(Event.prototype);
UniversalEventPlayerCreate.prototype.constructor = UniversalEventPlayerCreate;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that incorporates event details]
 * @return {void}
 */
UniversalEventPlayerCreate.prototype.execute = function(options) {
    if (!options.data || !options.data.guid) throw 'Invalid data attribute to create a Player instance!';
    PlayerManager.getInstance().addPlayer(options.data);
};

export default UniversalEventPlayerCreate;
