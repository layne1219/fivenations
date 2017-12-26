/* global window */
import Event from './Event';

const ns = window.fivenations;

function EntityAttack(...args) {
  Event.apply(this, args);
}

EntityAttack.prototype = Object.create(Event.prototype);
EntityAttack.prototype.constructor = EntityAttack;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 */
EntityAttack.prototype.execute = (options) => {
  if (!options.targets || !options.data) {
    return;
  }
  const addAsLast = options.data.addAsLast || false;
  options.targets.forEach((id) => {
    const targetEntity = ns.game.entityManager.entities(options.data.targetEntity);
    const entity = ns.game.entityManager.entities(id);
    if (options.resetActivityQueue) {
      entity.reset();
    }
    entity.attack(targetEntity, addAsLast);
  });
};

export default EntityAttack;
