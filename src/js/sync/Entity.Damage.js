/* eslint class-methods-use-this: 0 */
/* global window */
import Event from './Event';
import EventEmitter from './EventEmitter';
import PlayerManager from '../players/PlayerManager';
import Util from '../common/Util';

const ns = window.fivenations;

/**
 * Returns nearby allied entities of the given entity
 * @param {object} Entity
 */
function getNearbyAlliedEntitiesToEntity(entity) {
  return entity.getClosestAllyEntitiesInRange().filter((nearbyEntity) => {
    // filters all the entities out that are not idling
    // and farther then 200 pixels
    if (!nearbyEntity.isIdling()) return false;
    return Util.distanceBetween(entity, nearbyEntity) < 200;
  });
}

/**
 * Emits Universl Attack event for the given entity against the second entity
 * @param {object} Entity - entity
 * @param {object} Entity - target
 */
function attackTarget(entity, targetEntity) {
  if (!entity.isIdling()) return false;

  EventEmitter.getInstance()
    .synced.entities(entity)
    .attack({ targetEntity });
}

/**
 * Emits a synhcronized Attack event if the given entity idles
 * @param {object} Entity - entity
 * @param {object} Entity - target
 */
function notifyNearbyEntities(entity, targetEntity) {
  const entities = getNearbyAlliedEntitiesToEntity(entity);
  // attack
  EventEmitter.getInstance()
    .synced.entities(entities)
    .attack({ targetEntity });
}

class EntityDamage extends Event {
  /**
   * Executes the event's logic
   * @param {object} options
   */
  execute(options) {
    if (!options.targets || !options.data) {
      return;
    }
    const authorised = PlayerManager.getInstance()
      .getUser()
      .isAuthorised();
    const emitter = ns.game.entityManager.entities(options.data.emitterEntity);

    options.targets.forEach((id) => {
      const entity = ns.game.entityManager.entities(id);

      if (!entity) return;
      entity.damage(options.data);

      // if authorised we notify all the nearby allied entities
      // to attack the target who initially inflicted the damage
      if (authorised) {
        attackTarget(entity, emitter);
        notifyNearbyEntities(entity, emitter);
      }
    });
  }
}

export default EntityDamage;
