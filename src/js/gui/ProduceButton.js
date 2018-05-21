/* global window */
import EventEmitter from '../sync/EventEmitter';
import PlayerManager from '../players/PlayerManager';

const ns = window.fivenations;

/**
 * Returns an object holding all the required resources to produce
 * the given entity
 * @param {stirng} entityId - Id of the entity to be produced
 * @return {object} collection of the required resources
 */
function getRequiredResources(entityId) {
  const data = ns.game.game.cache.getJSON(entityId);
  return {
    titanium: data.titanium,
    silicium: data.silicium,
    uranium: data.uranium,
    energy: data.energy,
    space: data.space,
  };
}

/**
 * Returns the available resources of the current user
 * @return {object} collection of the available resources
 */
function getAvailableResources() {
  const user = PlayerManager.getInstance().getUser();
  return {
    titanium: user.getTitanium(),
    silicium: user.getSilicium(),
    energy: user.getEnergy(),
    space: user.getSupply(),
  };
}

/**
 * Checks if the user has the sufficient amount of resources to
 * get the production of the given entity kicked off
 * @param {stirng} entityId - Id of the entity to be produced
 * @return {boolean}
 */
function hasUserSufficientResources(entityId) {
  const emitter = EventEmitter.getInstance();
  const needed = getRequiredResources(entityId);
  const available = getAvailableResources();
  const keys = Object.keys(needed);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (needed[key] > available[key]) {
      emitter.local.dispatch(`resources/unsufficient/${key}`);
      return false;
    }
  }
  return true;
}

export default {
  activate(entityManager, controlPanel, button) {
    const entityId = button.getProducableEntity();
    const emitter = EventEmitter.getInstance();

    if (hasUserSufficientResources(entityId)) {
      emitter.synced
        .entities(':user:selected')
        .addProduction({ targetId: entityId });
    }
  },
};
