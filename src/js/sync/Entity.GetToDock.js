/* global window */
import Event from './Event';

const ns = window.fivenations;

function GetToDock(...args) {
  Event.apply(this, args);
}

GetToDock.prototype = Object.create(Event.prototype);
GetToDock.prototype.constructor = GetToDock;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 */
GetToDock.prototype.execute = (options) => {
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
    entity.getToDock(targetEntity, addAsLast);
  });
};

export default GetToDock;
