import Event from './Event';

const ns = window.fivenations;

function removeEffectByGUID(guid) {
  const effect = ns.game.effectManager.getEffectByGUID(guid);
  if (!effect) return;
  ns.game.effectManager.remove(effect);
}

function EffectRemove() {
  const args = [].slice.call(arguments);
  Event.apply(this, args);
}

EffectRemove.prototype = Object.create(Event.prototype);
EffectRemove.prototype.constructor = EffectRemove;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
EffectRemove.prototype.execute = function (options) {
  if (!options.targets) {
    return;
  }
  options.targets.forEach((guid) => {
    removeEffectByGUID(guid);
  });
};

export default EffectRemove;
