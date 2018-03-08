/* global window */
import Event from './Event';
import EventEmitter from './EventEmitter';

const ns = window.fivenations;

function EntityDamage(...args) {
  Event.apply(this, args);
}

class EntityDamage extends Event {
  /**
   * Creates EntityDamage instance
   */
  constructor() {
    super(...arguments);
  }

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
        this.notifyNearbyEntities(entity, emitter);
      }
    });
  }

  /**
   * Emits a synhcronized Attack event if the given entity idles
   * @param {object} Entity - entity
   * @param {object} Entity - target
   */
  notifyNearbyEntities(entity, targetEntity) {
    const entities = this.getNearbyAlliedEntitiesToEntity(entity);
    EventEmitter.getInstance()
      .synced.entities(entities)
      .attack({ targetEntity });
  }

  /**
   * Returns nearby allied entities of the given entity
   * @param {object} Entity
   */
  getNearbyAlliedEntitiesToEntity(entity) {
    return entity.getClosestAllyEntitiesInRange().filter((nearbyEntity) => {
      // filters all the entities out that are not idling
      // and farther then 200 pixels
      if (!nearbyEntity.isIdling()) return false;
      return Util.distanceBetween(entity, nearbyEntity) < 200;
    });
  }
}

export default EntityDamage;
