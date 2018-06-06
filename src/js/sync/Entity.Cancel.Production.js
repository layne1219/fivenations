/* global window */
/* eslint class-methods-use-this: 0 */
import Event from './Event';
import EventEmitter from './EventEmitter';

const ns = window.fivenations;

/**
 * Returns collection of key-value pairs of the required resources of
 * the given entity
 * @param {string} id
 * @return {object}
 */
function getRequiredResources(id) {
  const targetDO = ns.game.game.cache.getJSON(id);
  const titanium = targetDO.titanium;
  const silicium = targetDO.silicium;
  const uranium = targetDO.uranium;
  const energy = targetDO.energy;
  return {
    titanium,
    silicium,
    uranium,
    energy,
  };
}

/**
 * Emits Resource.Alter event to refund the player on cancellation
 * @param {object} player - Player instance
 * @param {string} id - Entity id
 */
function refundPlayer(player, id) {
  const emitter = EventEmitter.getInstance();
  emitter.synced.players(player).alter(getRequiredResources(id));
}

class EntityCancelProduction extends Event {
  /**
   * Executes the event based on the given paramater object
   * @param {object} options - {targtes: [array] of GUIDs of entities}
   */
  execute(options) {
    if (!options.targets || !options.data) {
      return;
    }
    options.targets.forEach((id) => {
      const entity = ns.game.entityManager.entities(id);
      const player = entity.getPlayer();
      const idx = options.data.productionSlotIdx;
      const slot = entity.getProductionManager().getSlotByIdx(idx);
      if (slot) {
        if (player.isAuthorised()) {
          refundPlayer(player, slot.id);
        }
        entity.cancelProduction(idx);
      }
    });
  }
}

export default EntityCancelProduction;
