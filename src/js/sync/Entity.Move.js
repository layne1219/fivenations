/* global window */
import Event from './Event';

const ns = window.fivenations;

function EntityMove(...args) {
  Event.apply(this, args);
}

EntityMove.prototype = Object.create(Event.prototype);
EntityMove.prototype.constructor = EntityMove;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
EntityMove.prototype.execute = (options) => {
  if (!options.targets || !options.data) {
    return;
  }

  options.targets.forEach((id, idx) => {
    const entity = ns.game.entityManager.entities(id);
    const x = options.data.x || options.data[idx].x;
    const y = options.data.y || options.data[idx].y;

    if (options.resetActivityQueue) {
      entity.reset();
    }

    entity.moveTo(x, y);
  });
};

export default EntityMove;
