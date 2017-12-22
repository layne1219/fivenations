/* global window */
import Event from './Event';

const ns = window.fivenations;

function EntityStop(...args) {
  Event.apply(this, args);
}

EntityStop.prototype = Object.create(Event.prototype);
EntityStop.prototype.constructor = EntityStop;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 * Expected Data format:
 * {
 *  id: 'entity/stop'
 *  targets: [124, 84],
 * }
 */
EntityStop.prototype.execute = (options) => {
  if (!options.targets) {
    return;
  }
  options.targets.forEach((id) => {
    ns.game.entityManager.entities(id).stop();
  });
};

export default EntityStop;
