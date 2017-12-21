import Event from './Event';

const ns = window.fivenations;

function EntityCreate() {
  const args = [].slice.call(arguments);
  Event.apply(this, args);
}

EntityCreate.prototype = Object.create(Event.prototype);
EntityCreate.prototype.constructor = EntityCreate;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
EntityCreate.prototype.execute = function (options) {
  let config;

  if (!options.data) {
    return;
  }

  config = options.data;
  ns.game.entityManager.add(config);
};

export default EntityCreate;
