/* global window */
/* eslint class-methods-use-this: 0 */
import Event from './Event';

const ns = window.fivenations;

class EntityMine extends Event {
  /**
   * Executes the event based on the given paramater object
   * @param {object} options - {targtes: [array] of GUIDs of entities}
   */
  execute(options) {
    if (!options.targets || !options.data) {
      return;
    }
    options.targets.forEach((id) => {
      const targetEntity = ns.game.entityManager.entities(options.data.targetEntity);
      const entity = ns.game.entityManager.entities(id);
      if (options.resetActivityQueue) {
        entity.reset();
      }
      entity.mine(targetEntity);
    });
  }
}

export default EntityMine;
