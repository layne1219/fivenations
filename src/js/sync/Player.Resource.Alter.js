/* global window */
import Event from './Event';
import PlayerManager from '../players/PlayerManager';

const ns = window.fivenations;

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
  if (!options.data || !options.data.guid) throw new Error('Invalid data attribute!');

  const player = PlayerManager.getInstance().getPlayerByGUID(options.data.guid);

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
