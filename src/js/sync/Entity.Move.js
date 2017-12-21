import Event from './Event';

const ns = window.fivenations;

function EntityMove() {
  const args = [].slice.call(arguments);
  Event.apply(this, args);
}

EntityMove.prototype = Object.create(Event.prototype);
EntityMove.prototype.constructor = EntityMove;

/**
 * No-op function to be overwritten in the child objects
 * @param {object} [options] [extendable object that presents event details]
 * @return {void}
 * @example
 * Expected Data format:
 * {
 * 	id: 'entity/move'
 * 	targets: [124, 84],
 * 	data: [
 * 		{x: 156, y:367},
 * 		{x: 179, y:380}
 * 	]
 * }
 */
EntityMove.prototype.execute = function (options) {
  if (!options.targets || !options.data) {
    return;
  }
  let x,
    y;

  options.targets.forEach((id, idx) => {
    const entity = ns.game.entityManager.entities(id);
    x = options.data.x || options.data[idx].x;
    y = options.data.y || options.data[idx].y;

    if (options.resetActivityQueue) {
      entity.reset();
    }

    entity.moveTo(x, y);
  });
};

export default EntityMove;
