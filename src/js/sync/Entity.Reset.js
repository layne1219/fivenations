/* global window */
import Event from './Event';

const ns = window.fivenations;

function EntityReset(...args) {
  Event.apply(this, args);
}

EntityReset.prototype = Object.create(Event.prototype);
EntityReset.prototype.constructor = EntityReset;

/**
 * Executes the event against the specified entity
 */
EntityReset.prototype.execute = (options) => {
  if (!options.targets) {
    return;
  }
  options.targets.forEach((id) => {
    ns.game.entityManager.entities(id).reset();
  });
};

export default EntityReset;
