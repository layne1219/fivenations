/* global window */
import Event from './Event';

const ns = window.fivenations;

function Place(...args) {
  Event.apply(this, args);
}

Place.prototype = Object.create(Event.prototype);
Place.prototype.constructor = Place;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 */
Place.prototype.execute = (options) => {
  if (!options.targets || !options.data) {
    return;
  }
  options.targets.forEach((id) => {
    const entity = ns.game.entityManager.entities(id);
    const sprite = entity.getSprite();
    const { x, y } = options.data;

    entity.reset();
    entity.getMotionManager().reset();

    sprite.x = x;
    sprite.y = y;
  });
};

export default Place;
