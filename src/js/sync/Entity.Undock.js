/* global window */
import Event from './Event';

const ns = window.fivenations;
const RANDOM_DISTANCE_FROM_DOCKER = 300;

function Undock(...args) {
  Event.apply(this, args);
}

Undock.prototype = Object.create(Event.prototype);
Undock.prototype.constructor = Undock;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 */
Undock.prototype.execute = (options) => {
  if (!options.targets) {
    return;
  }
  // recieves the random factor from the authorised client
  if (!options.data) options.data = {};
  const rnd = [].concat(options.data.rnd);

  options.targets.forEach((id, idx) => {
    const entityToUndock = ns.game.entityManager.entities(id);
    const sprite = entityToUndock.getSprite();
    const randomFactors = rnd[idx];

    if (options.resetActivityQueue) {
      entityToUndock.reset();
    }

    const undockedEntities = entityToUndock.undock();

    if (undockedEntities) {
      undockedEntities
        .map((entity) => {
          const dockedSprite = entity.getSprite();
          dockedSprite.x = sprite.x;
          dockedSprite.y = sprite.y;
          return entity;
        })
        .forEach((entity, index) => {
          const randomFactor = randomFactors[index] || 0;
          const dockedSprite = entity.getSprite();
          const randomX =
            (randomFactor * RANDOM_DISTANCE_FROM_DOCKER) - (RANDOM_DISTANCE_FROM_DOCKER / 2);
          const randomY =
            (randomFactor * RANDOM_DISTANCE_FROM_DOCKER) - (RANDOM_DISTANCE_FROM_DOCKER / 2);
          entity.moveTo(dockedSprite.x + randomX, dockedSprite.y + randomY);
        });
    }
  });
};

export default Undock;
