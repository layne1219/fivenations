/* global window */
/* eslint class-methods-use-this: 0 */
import Event from './Event';

const ns = window.fivenations;

class EntityCreateConstructionSite extends Event {
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

      if (options.resetActivityQueue) {
        entity.reset();
      }

      entity.createConstructionSite(options.data);
    });
  }
}

export default EntityCreateConstructionSite;
