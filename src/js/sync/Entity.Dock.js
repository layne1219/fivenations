/* global window */
import Event from './Event';

const ns = window.fivenations;

function Dock(...args) {
  Event.apply(this, args);
}

Dock.prototype = Object.create(Event.prototype);
Dock.prototype.constructor = Dock;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
Dock.prototype.execute = (options) => {
  if (!options.targets || !options.data) {
    return;
  }
  const addAsLast = options.data.addAsLast || false;
  options.targets.forEach((id) => {
    const targetEntity = ns.game.entityManager.entities(options.data.targetEntity);
    const entity = ns.game.entityManager.entities(id);
    if (!entity) return;
    if (options.resetActivityQueue) {
      entity.reset();
    }
    if (!targetEntity) return;
    targetEntity.dockTarget(entity, addAsLast);
  });
};

export default Dock;
