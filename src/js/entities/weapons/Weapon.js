import EventEmitter from '../../sync/EventEmitter';
import Util from '../../common/Util';
import { WEAPON_ACCURACY_SPREAD_IN_RADIAN } from '../../common/Const';

const ns = window.fivenations;
let guid = 0;

class Weapon {
  constructor(data) {
    this.data = Object.assign({}, data);
    this.ready = true;
    this.guid = guid;
    this.level = 0;
    guid += 1;

    this.onTargetEntityRemove = function () {
      this.clearTargetEntity();
    }.bind(this);
  }

  update() {
    if (this.isReady()) {
      if (this.hasTargetEntity()) {
        if (this.isReleasable()) {
          if (this.hasNoInstanceDelay()) {
            this.release();
          } else {
            this.reduceInstanceDelay();
          }
        }
      } else {
        this.scan();
      }
    } else {
      this.recharge();
    }
  }

  recharge() {
    if (this.freezeTime > 0) {
      this.freezeTime -= 1;
    } else {
      this.freezeTime = 0;
      this.ready = true;
    }
  }

  reduceInstanceDelay() {
    if (this.instanceDelayCounter > 0) {
      this.instanceDelayCounter -= 1;
    }
  }

  scan() {
    // if the weapon has a target already
    if (this.targetEntity) return;

    let targetTypes;
    let targetEntityType;
    const targetEntity = this.entity.getClosestHostileEntityInRange();

    // if there is no target nearby
    if (!targetEntity) {
      this.clearTargetEntity();
    } else {
      targetTypes = this.getTargetTypes();
      targetEntityType = targetEntity.getDataObject().getType();

      if (targetTypes && targetTypes.indexOf(targetEntityType) === -1) {
        return;
      }

      // if the weapon finds its target independently from the manual select
      if (this.isSelfContained()) {
        this.setTargetEntity(targetEntity);
      } else if (this.manager._lastEntityAttacked !== targetEntity) {
        EventEmitter.getInstance()
          .synced.entities(this.entity.getGUID())
          .attack({ targetEntity });
        this.manager._lastEntityAttacked = targetEntity;
      }
    }
  }

  release() {
    if (this.targetEntity) {
      this.fire(this.targetEntity);
    }
  }

  fire(targetEntity) {
    const targetSprite = targetEntity.getSprite();
    const projectileOffset = this.entity.getProjectileOffsetByHeading();
    const sprite = this.entity.getSprite();
    const distance = Util.distanceBetweenSprites(sprite, targetSprite);

    if (distance <= this.getRange()) {
      const accuracy = this.data.accuracy || 100;
      const spreadMax = WEAPON_ACCURACY_SPREAD_IN_RADIAN * (1 - accuracy / 100);
      const spread = Math.random() * spreadMax - spreadMax / 2;
      const rotation =
        ns.game.game.physics.arcade.angleBetween(sprite, targetSprite) + spread;
      const offsetX = projectileOffset.x || 0;
      const offsetY = projectileOffset.y || 0;
      const x = sprite.x + offsetX;
      const y = sprite.y + offsetY;
      let velocity = this.data.velocity;

      if (!velocity) {
        velocity = this.data.acceleration || this.data.maxVelocity;
      }

      EventEmitter.getInstance().synced.effects.add({
        id: this.data.effect,
        emitter: this,
        maxVelocity: this.data.maxVelocity,
        acceleration: this.data.acceleration,
        rotation,
        velocity,
        x,
        y,
      });

      this.freeze(this.data.cooldown);
    }
  }

  activate() {
    this.ready = true;
  }

  freeze(time) {
    this.ready = false;
    this.freezeTime = time || 0;
    this.instanceDelayCounter = this.instanceDelay;
  }

  increaseCooldown(value) {
    if (!this.data.cooldown) return;
    this.data.cooldown += value;
  }

  setManager(manager) {
    if (!manager) throw 'Invalid WeaponManager is passed!';
    this.manager = manager;
    this.entity = manager.getEntity();
    this.unconditionalRelease =
      this.entity.getDataObject().isFighter() || this.isSelfContained();
  }

  setTargetEntity(entity) {
    if (this.targetEntity) {
      this.targetEntity.off('remove', this.onTargetEntityRemove);
    }

    this.targetEntity = entity;
    this.targetEntity.on('remove', this.onTargetEntityRemove);
  }

  setInstanceDelay(delay) {
    this.instanceDelay = delay || 0;
    this.instanceDelayCounter = delay;
  }

  clearTargetEntity() {
    this.targetEntity = null;
  }

  getId() {
    return this.data.id;
  }

  getGUID() {
    return this.guid;
  }

  getManager() {
    return this.manager;
  }

  getName() {
    return this.data.name;
  }

  getDamage() {
    return this.data.damage;
  }

  getDamageShield() {
    return this.data.damage_shield;
  }

  getRange() {
    return this.data.range;
  }

  getAccuracy() {
    return this.data.accuracy;
  }

  getCurrentLevel() {
    return this.level;
  }

  getUpgradeLevel() {
    return this.data.upgrade_level;
  }

  getTargetEntity() {
    return this.targetEntity;
  }

  getTargetTypes() {
    return this.data.targetTypes;
  }

  getEffect() {
    return this.data.effect;
  }

  getInstanceDelay() {
    return this.data.instanceDelay;
  }

  toJSON() {
    return JSON.stringify(this.data, null, '  ');
  }

  isSelfContained() {
    return this.data.self_contained;
  }

  isReady() {
    return this.ready;
  }

  isReleasable() {
    if (this.unconditionalRelease) return true;

    // if the entity stands still
    if (this.entity.getMotionManager().movement.velocity !== 0) return false;

    // if the entity doesn't face target entity
    if (this.requiresEntityToFaceTarget()) {
      return this.entity
        .getMotionManager()
        .isEntityFacingTargetEntity(this.targetEntity);
    }

    return true;
  }

  isOffensive() {
    return this.getDamage() > 0 || this.getDamageShield() > 0;
  }

  hasFriendlyFire() {
    return this.data.friendly_fire;
  }

  hasTargetEntity() {
    return this.targetEntity;
  }

  hasNoInstanceDelay() {
    return !this.instanceDelay || this.instanceDelayCounter === 0;
  }

  requiresEntityToFaceTarget() {
    return this.data.requires_entity_to_face_target;
  }
}

export default Weapon;
