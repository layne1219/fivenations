import Event from './Event';
import Util from '../common/Util';

const ns = window.fivenations;
const RANDOM_DISTANCE_FROM_DOCKER = 200; 

function Undock() {
    var args = [].slice.call(arguments);
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
Undock.prototype.execute = function(options) {
    if (!options.targets) {
        return;
    }
    // recieves the random factor from the authorised client
    const rnd = options.rnd;

    options.targets.forEach(function(id) {
        const entityToUndock = ns.game.entityManager.entities(id);
        const sprite = entityToUndock.getSprite();
        let undockedEntities;

        if (options.resetActivityQueue) {
            entityToUndock.reset();
        }

        undockedEntities = entityToUndock.undock();
        
        if (undockedEntities) {
            undockedEntities.map(entity => {
                const dockedSprite = entity.getSprite();
                dockedSprite.x = sprite.x;
                dockedSprite.y = sprite.y;
                return entity;
            }).forEach(entity => {
                const dockedSprite = entity.getSprite();
                const randomX = rnd * RANDOM_DISTANCE_FROM_DOCKER - RANDOM_DISTANCE_FROM_DOCKER / 2;
                const randomY = rnd * RANDOM_DISTANCE_FROM_DOCKER - RANDOM_DISTANCE_FROM_DOCKER / 2;
                entity.moveTo({
                    x: dockedSprite.x + randomX,
                    y: dockedSprite.y + randomY
                });
            });
        }
    });
};

export default Undock;
