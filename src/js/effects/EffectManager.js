/* global window, Phaser, localStorage */
/* eslint no-underscore-dangle: 0 */
/* eslint class-methods-use-this: 0 */
import Util from '../common/Util';
import Graphics from '../common/Graphics';
import DataObject from '../model/DataObject';
import EventEmitter from '../sync/EventEmitter';
import Weapon from '../entities/weapons/Weapon';
import Effect from './Effect';

const DEFAULT_GRAPHICS_GROUP = 'effects';

let effects = [];
let phaserGame;
let singleton;

class EffectManager {
  constructor() {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
  }

  /**
   * Adds an effect object to the private collection
   * @param {object} config configuration object
   */
  add(config) {
    let point;
    let dataSource;

    const sprite = phaserGame.add.sprite(0, 0, config.id);

    // fetching the DataObject instance from the preloaded JSON file
    if (window.editor && localStorage && localStorage.getItem(config.id)) {
      dataSource = JSON.parse(localStorage.getItem(config.id));
    } else {
      dataSource = phaserGame.cache.getJSON(config.id);
    }
    const dataObject = new DataObject(dataSource);

    // adding the freshly created effect to the main array
    const effect = new Effect({
      guid: config.guid || Util.getGUID(),
      emitter: config.emitter,
      manager: this,
      sprite,
      dataObject,
    });

    // setting the coordinates if not ommitted
    if (config.x || config.y) {
      sprite.x = config.x || 0;
      sprite.y = config.y || 0;
    }

    // Heading of the effect
    if (config.rotation !== undefined) {
      sprite.rotation = config.rotation;
    } else if (config.angle !== undefined) {
      sprite.angle = config.angle;
    }

    // sets up velocity
    if (config.velocity) {
      if (config.rotation !== undefined) {
        point = phaserGame.physics.arcade.velocityFromRotation(
          config.rotation,
          config.velocity,
        );
      } else if (config.angle !== undefined) {
        point = phaserGame.physics.arcade.velocityFromAngle(
          config.angle,
          config.velocity,
        );
      } else if (config.velocity.x || config.velocity.y) {
        point = new Phaser.Point(
          config.velocity.x || 0,
          config.velocity.y || 0,
        );
      }

      if (point) {
        sprite.body.velocity = point;
      }

      // saving the original velocity for later use (like effects following targets)
      sprite.body._origVelocity = config.velocity;
      sprite.body._origAcceleration = config.acceleration;
    }

    // sets acceleration
    if (config.acceleration) {
      if (config.rotation !== undefined) {
        point = phaserGame.physics.arcade.accelerationFromRotation(
          config.rotation,
          config.acceleration,
        );
      } else if (config.angle !== undefined) {
        point = phaserGame.physics.arcade.accelerationFromAngle(
          config.angle,
          config.acceleration,
        );
      } else if (config.acceleration.x || config.acceleration.y) {
        point = new Phaser.Point(
          config.acceleration.x || 0,
          config.acceleration.y || 0,
        );
      }

      if (point) {
        sprite.body.acceleration = point;
      }
    }

    if (config.maxVelocity) {
      sprite.body.maxVelocity.set(config.maxVelocity);
    }

    sprite.body.drag.set(0);

    // adds sprite to the appropriate graphics group
    const groupName =
      dataObject.getTargetGraphicsGroup() || DEFAULT_GRAPHICS_GROUP;
    const group = Graphics.getInstance().getGroup(groupName);
    sprite._group = group;
    group.add(sprite);

    // triggers registered listener if any
    if (config.callback) {
      config.callback(effect);
    }

    // executes defined functionality in the data object
    const initEventConfig = dataObject.getEvent('create');

    if (initEventConfig) {
      let offsetX = 0;
      let offsetY = 0;

      // calculates the offset according to the weapon's parent entity
      const emitter = effect.getEmitter();
      if (emitter instanceof Weapon) {
        const emitterEntity = emitter.getManager().getEntity();
        const projectileOffset =
          (emitterEntity && emitterEntity.getProjectileOffsetByHeading()) || {};
        offsetX = projectileOffset.x || 0;
        offsetY = projectileOffset.y || 0;
      }

      const initEffects = initEventConfig.effects || [];

      initEffects.forEach((effectId) => {
        this.add({
          id: effectId,
          x: sprite.x + offsetX,
          y: sprite.y + offsetY,
        });
      });

      if (initEventConfig.execute) {
        const exec = initEventConfig.execute;
        const target = exec.target === 'self' ? effect : null;
        const func = this[exec.command] && this[exec.command].bind(this);

        if (func) func(target);
      }
    }

    // pushes it to the local effect collection
    effects.push(effect);
  }

  /**
   * Removes effect from the private collection
   * @param {object} effect Effect instance
   */
  remove(effect) {
    if (!effect) return;
    for (let i = effects.length - 1; i >= 0; i -= 1) {
      if (effect === effects[i]) {
        effects.splice(i, 1);
      }
    }
    effect.remove();
    // eslint-disable-next-line no-param-reassign
    effect = null;
  }

  /**
   * destroys all the existing effects
   * @return {void}
   */
  reset() {
    effects = [];
  }

  /**
   * Update function called on every tick
   * @param {boolean} authoritative Flag to indicate the authoritative client
   * @return {void}
   */
  update(authoritative) {
    for (let i = effects.length - 1; i >= 0; i -= 1) {
      if (authoritative && this.isEffectExpired(effects[i])) {
        EventEmitter.getInstance()
          .synced.effects(effects[i])
          .remove();
      } else {
        this.followTarget(effects[i]);
        this.emitTrails(effects[i]);
        this.idle(effects[i]);
      }
    }
  }

  /**
   * Updates ttl attribute of the given effect entity and returns
   * @param {object} effect Effect entity
   * @return {boolean} true if the effect needs to be removed
   */
  isEffectExpired(effect) {
    if (effect.ttl === 0) return true;
    if (effect.ttl > 0) effect.ttl -= 1;
    return false;
  }

  /**
   * returns the Phaser.Game object for inconvinience
   * @return {[object]} [Phaser.Game instnace]
   */
  getGame() {
    return phaserGame;
  }

  /**
   * Returns the array of effects or an empty array
   * @param {string} guid
   * @return {object} effect instance
   */
  getEffectByGUID(guid) {
    for (let i = effects.length - 1; i >= 0; i -= 1) {
      if (effects[i].getGUID() === guid) {
        return effects[i];
      }
    }
    return null;
  }

  /**
   * Returns an instance of the AnimationManager class
   * @return {object} instancse of AnimationManager class
   */
  getAnimationManager() {
    return this.animationManager;
  }

  /** *****************************************************************************
   *                         EFFECT MANIPULATOR FUNCTIONALITIES                  *
   ****************************************************************************** */

  /**
   * Triggers an explosion animation configured in the DataObject
   * @param {object} entity Any object possesses DataObject instance
   */
  explode(entity) {
    if (!entity || !entity.getDataObject) return;

    let effectId;
    let minWrecks;
    let maxWrecks;
    let i;
    const eventData = entity.getDataObject().getEvent('remove');

    if (!eventData) return;

    const sprite = entity.getSprite();

    if (eventData.effects && eventData.effects.length) {
      if (eventData.randomize) {
        effectId = eventData.effects[Util.rnd(0, eventData.effects.length - 1)];
        this.add({
          id: effectId,
          x: sprite.x,
          y: sprite.y,
          emitter: entity,
        });
      } else {
        eventData.effects.forEach((id) => {
          this.add({
            x: sprite.x,
            y: sprite.y,
            emitter: entity,
            id,
          });
        });
      }
    }

    if (eventData.wrecks && eventData.wrecks.length) {
      minWrecks = eventData.minWrecks || 0;
      maxWrecks = eventData.maxWrecks || 0;
      for (i = minWrecks; i <= maxWrecks; i += 1) {
        effectId = eventData.wrecks[Util.rnd(0, eventData.wrecks.length - 1)];
        this.add({
          id: effectId,
          x: sprite.x + Util.rnd(0, 30) - 15,
          y: sprite.y + Util.rnd(0, 30) - 15,
          velocity: {
            x: (Math.random() - 0.5) * Util.rnd(75, 100),
            y: (Math.random() - 0.5) * Util.rnd(75, 100),
          },
        });
      }
    }
  }

  /**
   * makes the given effect to follow its target if specififed
   * @param  {object} effect Effect entity
   * @return {void}
   */
  followTarget(effect) {
    if (!effect.willFollowTarget()) return;

    const targetEntity = effect.getTargetEntity();
    let rotation;
    let sprite;
    let targetSprite;

    if (!targetEntity) {
      effect.ttl = 0;
    } else {
      sprite = effect.getSprite();
      targetSprite = targetEntity.getSprite();

      if (sprite.body.speed >= sprite.body.maxVelocity.x) {
        rotation = phaserGame.physics.arcade.angleBetween(sprite, targetSprite);

        if (sprite.rotation !== rotation) {
          // Calculate difference between the current angle and rotation
          let delta = rotation - sprite.rotation;

          // Keep it in range from -180 to 180 to make the most efficient turns.
          if (delta > Math.PI) delta -= Math.PI * 2;
          if (delta < -Math.PI) delta += Math.PI * 2;

          if (delta > 0) {
            // Turn clockwise
            sprite.angle += 5;
          } else {
            // Turn counter-clockwise
            sprite.angle -= 5;
          }

          // Just set angle to target angle if they are close
          if (Math.abs(delta) < sprite.game.math.degToRad(5)) {
            sprite.rotation = rotation;
          }
        }

        phaserGame.physics.arcade.velocityFromRotation(
          sprite.rotation,
          sprite.body.speed,
          sprite.body.velocity,
        );
      }
    }
  }

  /**
   * emits the effects configured as trail
   * @param  {object} effect Effect entity
   * @return {void}
   */
  emitTrails(effect) {
    if (!effect.hasTrails()) return;

    if (effect.ttl % effect.getTrailsRate() === 0) {
      this.add({
        id: effect.getTrailsEffect(),
        x: effect.getSprite().x + Util.rnd(0, 10) - 5,
        y: effect.getSprite().y + Util.rnd(0, 10) - 5,
      });
    }
  }

  /**
   * executes the pre-defined idle actions
   * @param  {object} effect Effect entity
   * @return {void}
   */
  idle(effect) {
    if (!effect.hasIdle()) return;

    const randomize = effect.shouldIdleEffectsGetRandomized();

    if (randomize) {
      const odds = Math.floor(Math.random() * effect.getIdleRandomRate());
      if (odds === 0) {
        const idleEffects = effect.getIdleEffects();
        const idx = Util.rnd(0, idleEffects.length - 1);
        const offset = effect.getIdleEffectOffset();

        this.add({
          id: idleEffects[idx],
          x: effect.getSprite().x + offset.x,
          y: effect.getSprite().y + offset.y,
        });
      }
    }
  }

  /**
   * makes the effects flash and disappear quickly
   * @param  {object} effect Effect entity
   * @return {void}
   */
  flash(effect) {
    if (!effect) return;

    const sprite = effect.getSprite();
    sprite.alpha = 0;

    const flashTween = phaserGame.add
      .tween(sprite)
      .to({ alpha: 1 }, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
    flashTween.onComplete.add(() => this.remove(effect));
  }
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
   * @param {boolean} forceNewInstance
   * @return {object} Singleton instance of EffectManager
   */
  getInstance(forceNewInstance) {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton || forceNewInstance) {
      singleton = new EffectManager();
      singleton.reset();
    }
    return singleton;
  },
};
