import Graphics from './Graphics';
import EventEmitter from '../sync/EventEmitter';

let phaserGame;
let singleton;

/**
 * creates a singleton instance with the given configurations
 * @param  {object} config
 * @return {objet}
 */
function createCollisionManager() {
  const entityGroup = Graphics.getInstance().getGroup('entities');
  const entityBuildingGroup = Graphics.getInstance().getGroup('entities-buildings');
  const effectGroup = Graphics.getInstance().getGroup('projectiles');

  return {
    update(authoritative) {
      if (authoritative) {
        phaserGame.physics.arcade.overlap(effectGroup, entityGroup, null, collisionHandler);
        phaserGame.physics.arcade.overlap(effectGroup, entityBuildingGroup, null, collisionHandler);
      }
    },
  };
}

/**
 * Callback to handle collisions between effects and entities
 * @param {object} effectSprite - Phaser.Sprite
 * @param {object} entitySprite - Phaser.Sprite
 */
function collisionHandler(effectSprite, entitySprite) {
  const entity = entitySprite._parent;
  const effect = effectSprite._parent;
  const weapon = effect.getEmitter();
  let getEmitterEntity;

  if (!entity || !effect || !weapon) return;

  if (effect._readyToUnmount) return;

  getEmitterEntity = weapon.getManager().getEntity();

  // effect mainly cannot collide with the entity that initially emitted it
  if (getEmitterEntity === entity) return;

  // effect cannot collide with hibernated entities
  if (entity.isHibernated()) return;

  // effect cannot collide with friendly entities unless the friendly fire is on
  if (!getEmitterEntity.isEnemy(entity) && !weapon.hasFriendlyFire()) return;

  const collisionEvent = effect.getDataObject().getEvent('collision');
  const eventEmitter = EventEmitter.getInstance();

  if (collisionEvent.removeEffect) {
    effect._readyToUnmount = true;
    eventEmitter.synced.effects(effect).remove();
  }

  if (collisionEvent.damageTarget) {
    eventEmitter.synced.entities(entity).damage({ weapon });
  }

  // we don't need the arcade collision logic to separate the
  // colliding objects. For more information see:
  // https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#overlap
  return false;
}

export default {
  /**
   * sets the global Phaser.Game instance
   * @param {void}
   */
  setGame(game) {
    phaserGame = game;
  },

  /**
   * returns singleton instance of the manager object
   * @return {object} Singleton instance of EntityManager
   */
  getInstance() {
    if (!phaserGame) {
      throw 'Invoke setGame first to pass required Phaser.Game instance!';
    }
    if (!singleton) {
      singleton = createCollisionManager();
    }
    return singleton;
  },
};
