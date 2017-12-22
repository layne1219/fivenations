/* global window */
import Event from './Event';

const ns = window.fivenations;

function EntityPatrol(...args) {
  Event.apply(this, args);
}

EntityPatrol.prototype = Object.create(Event.prototype);
EntityPatrol.prototype.constructor = EntityPatrol;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
EntityPatrol.prototype.execute = (options) => {
  if (!options.targets || !options.data) {
    return;
  }
  const { x, y } = options.data;

  options.targets.forEach((id) => {
    const entity = ns.game.entityManager.entities(id);

    if (options.resetActivityQueue) {
      entity.entities(id).reset();
    }

    entity.patrol(x, y);
  });
};

export default EntityPatrol;
