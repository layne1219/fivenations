/* global window */
/* eslint class-methods-use-this: 0 */
import Event from './Event';
import EventEmitter from './EventEmitter';
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
  };
}

/**
 * Emits a Player.Alter Universal event
 * @param {object} player - Player instance
 * @param {string} entityId - Id of the entity from which the needed
 * resource values are fetched
 */
function alterResources(player, entityId) {
  const emitter = EventEmitter.getInstance();
  emitter.synced.player(player.getGUID()).alter(getRequiredResources(entityId));
}

class EntityProduce extends Event {
  /**
   * Executes the event based on the given paramater object
   * @param {object} options - {targtes: [array] of GUIDs of entities}
   */
  execute(options) {
    if (!options.targets || !options.data) {
      return;
    }

    const authorised = PlayerManager.getInstance()
      .getUser()
      .isAuthorised();

    options.targets.forEach((id) => {
      const entity = ns.game.entityManager.entities(id);
      const entityIdToBeProduced = options.data.targetId;
      entity.produce(entityIdToBeProduced);

      if (authorised) {
        const player = entity.getPlayer();
        alterResources(player, entityIdToBeProduced);
      }
    });
  }
}

export default EntityProduce;
