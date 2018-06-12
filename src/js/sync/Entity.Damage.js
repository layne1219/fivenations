/* eslint class-methods-use-this: 0 */
/* global window */
import Event from './Event';
import EventEmitter from './EventEmitter';
import PlayerManager from '../players/PlayerManager';
import Util from '../common/Util';

const ns = window.fivenations;

/**
 * Returns nearby entities in the given splash range
 * @param {object} entity - Entity instance
 * @param {object} data { splashRange, splash }
 */
function getNearbyEntitiesinSplashRange(entity, data) {
  const hostileEntities = entity.getClosestHostileEntityInRange();
  const alliedEntities = entity.getClosestAllyEntitiesInRange();
  const { splashRange, doesSplashDamageAllies, emitterTeam } = data;
  let entities = [];

  if (hostileEntities) {
    entities = entities.concat(hostileEntities);
  }
  if (alliedEntities) {
    entities = entities.concat(alliedEntities);
  }
  return entities
    .map(nearbyEntity => ({
      entity: nearbyEntity,
      distance: Util.distanceBetween(entity, nearbyEntity),
    }))
    .filter(obj => obj.distance <= splashRange)
    .filter((obj) => {
      if (doesSplashDamageAllies) return true;
      return emitterTeam !== obj.entity.getTeam();
    });
}

/**
 * Damages nearby entities
 * @param {object} entity - Entity instance
 * @param {object} data - further details about the Damage event
 */
function damageEntitiesInSplashRange(entity, data) {
  const list = getNearbyEntitiesinSplashRange(entity, data);
  const { damage, damageShield, splashRange } = data;
  list.forEach((obj) => {
    const factor = Math.max(0, 1 - obj.distance / splashRange);
    obj.entity.damage({
      damage: Math.ceil(damage * factor),
      damageShield: Math.ceil(damageShield * factor),
    });
  });
}

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
  if (!targetEntity) return;
  if (!entity.isIdling()) return;

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
  if (!targetEntity) return;
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
    const { targets, data } = options;

    if (!targets || !data) {
      return;
    }
    const authorised = PlayerManager.getInstance()
      .getUser()
      .isAuthorised();
    const emitter = ns.game.entityManager.entities(data.emitterEntity);

    targets.forEach((id) => {
      const entity = ns.game.entityManager.entities(id);

      if (!entity) return;
      const isKilled = entity.damage(data);

      // if Splash damage range is
      if (data.splashRange) {
        damageEntitiesInSplashRange(entity, data);
      }

      // if authorised we notify all the nearby allied entities
      // to attack the target who initially inflicted the damage
      if (authorised) {
        notifyNearbyEntities(entity, emitter);
        if (!isKilled) {
          attackTarget(entity, emitter);
        }
      }
    });
  }
}

export default EntityDamage;
