/* global window */
import Event from './Event';

const ns = window.fivenations;

function EntityFire(...args) {
  Event.apply(this, args);
}

EntityFire.prototype = Object.create(Event.prototype);
EntityFire.prototype.constructor = EntityFire;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
EntityFire.prototype.execute = (options) => {
  if (!options.targets || !options.data) {
    return;
  }

  options.targets.forEach((id, idx) => {
    const entity = ns.game.entityManager.entities(id);
    const targetEntity = ns.game.entityManager.entities(options.data.targetEntity);

    if (!entity || !targetEntity) return;
    if (!options.data.weaponGUIDs[idx]) return;

    const weapons = entity
      .getWeaponManager()
      .getWeapons()
      .filter((weapon) => {
        for (let i = options.data.weaponGUIDs[idx].length - 1; i >= 0; i -= 1) {
          if (options.data.weaponGUIDs[idx][i] === weapon.getGUID()) {
            return true;
          }
        }
        return false;
      });

    if (options.resetActivityQueue) {
      entity.reset();
    }

    entity.fire(targetEntity, weapons);
  });
};

export default EntityFire;
