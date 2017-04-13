import Event from './Event';
import PlayerManager from '../players/PlayerManager';
import EventEmitter from './EventEmitter';
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
    options.targets.forEach(function(id) {
        var entity = ns.game.entityManager.entities(id);
        var undockedEntities;
        var authorised = PlayerManager
            .getInstance()
            .getUser()
            .isAuthorised();

        if (options.resetActivityQueue) {
            entity.reset();
        }

        undockedEntities = entity.undock();
        
        // if the player is authorised we'll have to emit
        // further events 
        if (authorised && undockedEntities) {
            EventEmitter
                .getInstance()
                .synced
                .entities(undockedEntities)
                .place({
                    x: entity.getSprite().x,
                    y: entity.getSprite().y
                })
                .move({
                    x: entity.getSprite().x + Util.rnd(1, RANDOM_DISTANCE_FROM_DOCKER) - RANDOM_DISTANCE_FROM_DOCKER / 2,
                    y: entity.getSprite().y + Util.rnd(1, RANDOM_DISTANCE_FROM_DOCKER) - RANDOM_DISTANCE_FROM_DOCKER / 2,
                });
        }
    });
};

export default Undock;
