/* global Phaser */
/* eslint no-underscore-dangle: 0 */
import Util from '../common/Util';
import Entity from '../entities/Entity';
import Weapon from '../entities/weapons/Weapon';

const DEFAULT_ANIM_NAME = 'idle';

/**
 * Registers a listener to the remove Event
 */
function registerRemoveEventToAnimation(effect, animation) {
  animation.onComplete.add(() => {
    effect.getManager().remove(effect);
  });
}

class Effect {
  /**
   * initialises a Effect instance
   * @param {object} config Configuration object to initialise the effect object
   * @return {object}
   */
  constructor(config) {
    this.setGUID(config);
    this.setManager(config);
    this.setDataObject(config);
    this.setEmitter(config);
    this.setSprite(config);
    this.setAnimations(config);
    this.setTTL(config);
  }

  /**
   * Sets the unique id
   * @param {object} config
   */
  setGUID(config) {
    this.guid = config.guid;
  }

  /**
   * Registers the EffectManager instance
   * @param {config} config Configuration object that contains the reference to the manager instance
   */
  setManager(config) {
    this.manager = config.manager;
  }

  /**
   * Saves the DataObject instance to the object scope
   * @param {config} config Configuration object that contains the reference to the manager instance
   */
  setDataObject(config) {
    this.dataObject = config.dataObject;
    this.trails = this.dataObject.getTrails();
    this.idle = this.dataObject.getEvent('idle');
  }

  /**
   * Saves the object reference that invoked the EffectManager to generate this very effect instance
   * @param {config} config Configuration object that contains the reference to the manager instance
   */
  setEmitter(config) {
    if (config.emitter) {
      this.emitter = config.emitter;
      if (this.emitter instanceof Effect || this.emitter instanceof Weapon) {
        this.targetEntity = this.emitter.getTargetEntity();
        if (!this.targetEntity) return;
        this.onTargetEntityRemove = this.removeTargetEntity.bind(this);
        this.targetEntity.on('remove', this.onTargetEntityRemove);
      }
    }
  }

  /**
   * Prepares to sprite to further use
   * @param {object} config Configuration object
   * @return {void}
   */
  setSprite(config) {
    const game = config.manager.getGame();
    const { dataObject } = config;

    this.sprite = config.sprite;
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.x = 0;
    this.sprite.y = 0;
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    // reduces the hitArea according the one specified in the realated DataObject
    this.sprite.hitArea = new Phaser.Rectangle(
      dataObject.getWidth() / -2,
      dataObject.getHeight() / -2,
      dataObject.getWidth(),
      dataObject.getHeight(),
    );
    this.sprite.body.setSize(
      dataObject.getWidth(),
      dataObject.getHeight(),
      0,
      0,
    );

    // sets frame if the effect has multiple variances
    const variances = dataObject.getVariances();
    if (variances.length) {
      this.sprite.frame = variances[Util.rnd(0, variances.length - 1)];
    }

    // sets custom frame if it's configured in the DO
    const customFrame = dataObject.getCustomFrame();
    if (customFrame !== undefined) {
      this.sprite.frame = customFrame;
    }

    if (
      dataObject.doesPersistOrienationFromEmitter() &&
      this.emitter instanceof Entity
    ) {
      const angle = this.emitter.getMotionManager().getCurrentAngleInDeg();
      const frames = dataObject.getFrames();
      const numberOfFrames = frames.length;
      const ratio = angle / 360;
      const idx = Math.round(numberOfFrames * ratio);
      this.sprite.frame = frames[idx];
    }

    this.sprite._parent = this;
  }

  /**
   * Registers animations sequences against the given sprite object if there
   * is any specified in the DO
   * @param  {object} config [configuration object to initialise animations]
   * @return {void}
   */
  setAnimations(config) {
    const { dataObject } = config;
    const animations = dataObject.getAnimations();
    if (!animations || typeof animations !== 'object') return;
    Object.keys(animations).forEach((key) => {
      const data = animations[key];
      const animation = this.sprite.animations.add(
        key,
        data.frames,
        data.rate,
        data.loopable,
      );

      if (data.oncomplete === 'remove') {
        registerRemoveEventToAnimation(this, animation);
      }

      if (data.oncomplete === 'keepLastFrame') {
        animation.onComplete.add(() => {
          this.sprite.frame = data.frames[data.frames.length - 1];
        });
      }

      if (key === DEFAULT_ANIM_NAME) {
        this.sprite.animations.play(key);
      }
    });
  }

  setTTL(config) {
    this.ttl = config.dataObject.getTTL();
  }

  remove() {
    if (this.targetEntity) {
      this.targetEntity.off('remove', this.onTargetEntityRemove);
    }
    this.sprite._group.remove(this.sprite);
    this.sprite.destroy();
    this.manager.explode(this);
  }

  /**
   * Removes target entity
   */
  removeTargetEntity() {
    this.targetEntity = null;
  }

  getId() {
    return this.id;
  }

  getGUID() {
    return this.guid;
  }

  getSprite() {
    return this.sprite;
  }

  getEmitter() {
    return this.emitter;
  }

  getTargetEntity() {
    return this.targetEntity;
  }

  getDataObject() {
    return this.dataObject;
  }

  willFollowTarget() {
    return this.dataObject.getFollowTarget();
  }

  hasTrails() {
    return !!this.trails;
  }

  getTrailsRate() {
    return this.trails.rate;
  }

  getTrailsEffect() {
    return this.trails.effect;
  }

  hasIdle() {
    return !!this.idle;
  }

  getIdleEffects() {
    return this.idle.effects;
  }

  shouldIdleEffectsGetRandomized() {
    return this.idle.randomExecution;
  }

  getIdleRandomRate() {
    return this.idle.randomRate;
  }

  getIdleEffectOffset() {
    const offset = {};
    const offsetAttrs = ['offsetX', 'offsetY'];
    offsetAttrs.forEach((val) => {
      if (this.idle[val]) {
        if (this.idle[val].length) {
          offset[val] = Util.rnd(this.idle[val][0], this.idle[val][1] * 2);
        } else {
          offset[val] = this.idle[val];
        }
      }
    });
    return {
      x: offset.offsetX,
      y: offset.offsetY,
    };
  }

  getManager() {
    return this.manager;
  }
}

export default Effect;
