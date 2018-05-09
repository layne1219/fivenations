/* global window */
/* eslint class-methods-use-this: 0 */
import Event from './Event';

const ns = window.fivenations;

class EntityProduce extends Event {
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
      const entityIdToBeProduced = options.data.id;
      entity.produce(entityIdToBeProduced);
    });
  }
}

export default EntityProduce;
