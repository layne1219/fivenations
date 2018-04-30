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
    titanium, silicium, energy, uranium, overwrite,
  } = options.data;

  if (overwrite) {
    if (undefined !== titanium) player.setTitanium(titanium);
    if (undefined !== silicium) player.setSilicium(silicium);
    if (undefined !== energy) player.setEnergy(energy);
    if (undefined !== uranium) player.setUranium(uranium);
  } else {
    const currentTitanium = player.getTitanium();
    const currentSilicium = player.getSilicium();
    const currentEnergy = player.getEnergy();
    const currentUranium = player.getUranium();
    player.setTitanium(currentTitanium + (titanium || 0));
    player.setSilicium(currentSilicium + (silicium || 0));
    player.setEnergy(currentEnergy + (energy || 0));
    player.setUranium(currentUranium + (uranium || 0));
  }

  if (player.isControlledByUser()) {
    const dispatcher = EventEmitter.getInstance().local;
    dispatcher.dispatch('user/resource/alter');
  }
};

export default PlayerResourceAlter;
