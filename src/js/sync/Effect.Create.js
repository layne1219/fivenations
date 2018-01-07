/* global window */
import Event from './Event';

const ns = window.fivenations;

function EffectCreate(...args) {
  Event.apply(this, args);
}

EffectCreate.prototype = Object.create(Event.prototype);
EffectCreate.prototype.constructor = EffectCreate;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
EffectCreate.prototype.execute = (options) => {
  if (!options.data) {
    return;
  }

  const config = options.data;
  ns.game.effectManager.add(config);
};

export default EffectCreate;
