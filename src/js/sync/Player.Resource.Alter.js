import Event from './Event';
import EventEmitter from './EventEmitter';
import PlayerManager from '../players/PlayerManager';

function PlayerResourceAlter(...args) {
  Event.apply(this, args);
}

PlayerResourceAlter.prototype = Object.create(Event.prototype);
PlayerResourceAlter.prototype.constructor = PlayerResourceAlter;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @throws {object}
 */
PlayerResourceAlter.prototype.execute = (options) => {
  if (!options.data || !options.data.guid) {
    throw new Error('Invalid data attribute!');
  }

  const player = PlayerManager.getInstance().getPlayerByGUID(options.data.guid);
  const {
    titanium, silicium, energy, uranium,
  } = options.data;

  if (undefined !== titanium) player.setTitanium(titanium);
  if (undefined !== silicium) player.setSilicium(silicium);
  if (undefined !== energy) player.setEnergy(energy);
  if (undefined !== uranium) player.setUranium(uranium);

  if (player.isControlledByUser()) {
    const dispatcher = EventEmitter.getInstance().local;
    dispatcher.dispatch('user/resource/alter');
  }
};

export default PlayerResourceAlter;
