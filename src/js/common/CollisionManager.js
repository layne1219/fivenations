/* eslint no-underscore-dangle: 0 */
import Graphics from './Graphics';
import EventEmitter from '../sync/EventEmitter';
import AudioManager from '../audio/AudioManager';

let phaserGame;
let singleton;

/**
 * Callback to handle collisions between effects and entities
 * @param {object} effectSprite - Phaser.Sprite
 * @param {object} entitySprite - Phaser.Sprite
 */
function collisionHandler(effectSprite, entitySprite) {
  const entity = entitySprite._parent;
  const effect = effectSprite._parent;
  const weapon = effect.getEmitter();

  if (!entity || !effect || !weapon) return false;

  if (effect._readyToUnmount) return false;

  const emitterEntity = weapon.getManager().getEntity();
  const targetEntity = weapon.getManager().getTargetEntity();

  // effect mainly cannot collide with the entity that initially emitted it
  if (emitterEntity === entity) return false;

  // effect cannot collide with hibernated entities
  if (entity.isHibernated()) return false;

  // effect cannot collide with friendly entities unless the friendly fire is on
  // or the effect was released through target firing
  if (!emitterEntity.isEnemy(entity) && !weapon.hasFriendlyFire()) {
    if (!effect.hasReleasedThroughTargetFiring()) {
      return false;
      // if the effect was released through target firing it must collide
      // only with the target when it comes to allied entities
    } else if (entity !== targetEntity) {
      return false;
    }
  }

  // effect cannot hit Fighters if CHF is zero
  if (!weapon.canHitFighters() && entity.getDataObject().isFighter()) {
    return false;
  }

  const collisionEvent = effect.getDataObject().getEvent('collision');
  const eventEmitter = EventEmitter.getInstance();

  if (collisionEvent.removeEffect) {
    effect._readyToUnmount = true;
    eventEmitter.synced.effects(effect).remove();
  }

  if (collisionEvent.damageTarget) {
    eventEmitter.synced.entities(entity).damage({ weapon });
  }

  if (collisionEvent.audio) {
    AudioManager.getInstance().playAudioSpriteByConfig(collisionEvent.audio);
  }

  // we don't need the arcade collision logic to separate the
  // colliding objects. For more information see:
  // https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#overlap
  return false;
}

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
        phaserGame.physics.arcade.overlap(
          effectGroup,
          entityGroup,
          null,
          collisionHandler,
        );
        phaserGame.physics.arcade.overlap(
          effectGroup,
          entityBuildingGroup,
          null,
          collisionHandler,
        );
      }
    },
  };
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
      throw new Error('Invoke setGame first to pass required Phaser.Game instance!');
    }
    if (!singleton) {
      singleton = createCollisionManager();
    }
    return singleton;
  },
};
