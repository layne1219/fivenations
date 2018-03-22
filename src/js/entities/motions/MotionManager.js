import EffectManager from './EffectManager';
import Effects from './Effects';
import Util from '../../common/Util';
import { TILE_WIDTH } from '../../common/Const';

/**
 * Constructor function to initialise the MotionManager
 * @param {[object]} entity [The target entity whose coordinates will be altered by the applied effects]
 */
function MotionManager(entity) {
  this.game = entity.game;

  this.dispatcher = new Util.EventDispatcher();
  this.effectManager = new EffectManager(this);

  this.entity = entity;
  this.sprite = entity.getSprite();
  this.animationManager = entity.getAnimationManager();
  this.rotationFrames = createRotationFrames(entity);

  this.movement = createMovementObject(entity);
  this.rotation = createRotationObject(entity);
  this.levitation = createLevitationObject(entity);

  this.isEntityArrivedAtDestination = false;
  this.isEntityStoppedAtDestination = false;
  this.isEntityHeadedToDestination = false;

  this.collisionPoints = {};
}

/**
 * creates a structure for the helper variables placed into a
 * namespace
 * @param  {object} entity given Entity needs to be moved
 * @return {object} prototype of movement related helper variables
 */
function createMovementObject(entity) {
  const dataObject = entity.getDataObject();
  return {
    velocity: 0,
    acceleration: 0,
    currentAngle: Phaser.Math.degToRad(90),
    maxVelocity: dataObject.getSpeed(),
    maxAcceleration: dataObject.getSpeed(),
    maxTargetDragTreshold: dataObject.getSpeed(),
  };
}

/**
 * creates a structure for the helper variables placed into a
 * namespace
 * @param  {object} entity given Entity needs to be moved
 * @return {object} prototype of rotation related helper variables
 */
function createRotationObject(entity) {
  const dataObject = entity.getDataObject();
  const hasRealManeuverSystem = dataObject.hasRealManeuverSystem();
  const maneuverability = dataObject.getManeuverability();

  return {
    realManeuverSystem: hasRealManeuverSystem,
    targetAngleCode: 0,
    currentAngleCode: 0,
    maxAngleCount: dataObject.getDirections(),
    angularVelocity: 0,
    angularVelocityHelper: 0,
    maxAngularVelocity: maneuverability,
    framePadding: dataObject.getAnimFrame() || 1,
  };
}

/**
 * Creates helper attributes for the idle-like float animation
 * @param  {object} entity given Entity needs to be moved
 * @return {object} prototype of rotation related helper variables
 */
function createLevitationObject(entity) {
  return {
    time: 0,
    defaultAnchorY: entity.getSprite().anchor.y,
  };
}

/**
 * Generates a list of frames that makes a full rotation cycle
 * @param  {object} entity - Entity instance to which the animations belong
 * @return {array} array that incorporates the frames for rotation
 */
function createRotationFrames(entity) {
  const data = entity.getDataObject();
  const animationOffset = data.getAnimationOffset();
  const moveAnimation = data.getAnimationByKey('move');

  if (moveAnimation && moveAnimation.length) {
    return moveAnimation.map((anim) => {
      if (!anim || !anim.frames || !anim.frames.length) return 0;
      return anim.frames[0] + animationOffset;
    });
  }
  const directions = data.getDirections() || 1;
  const framePadding = data.getAnimFrame() || 1;
  const frames = [];
  for (let i = 0; i < directions; i += 1) {
    frames.push(i * framePadding + animationOffset);
  }
  return frames;
}

MotionManager.prototype = {
  /**
   * Make the entity move from its current position to the target coords. The operation also
   * calculates all the required helper variables including the rotoation.
   * @param  {object} activity Reference to the given Activity instance
   * @return {void}
   */
  moveTo(activity) {
    this.activity = activity;

    this.effectManager.resetEffects();
    this.effectManager.execute(Effects.get('initMovement'));

    if (this.isRequiredToStopBeforeFurtherAction()) {
      this.effectManager.addEffect(Effects.get('stopping'));
      this.effectManager.addEffect(Effects.get('resetMovement'));
    }

    if (!this.hasRealManeuverSystem() && !this.isEntityFacingTarget()) {
      this.effectManager.addEffect(Effects.get('stopAnimation'));
      this.effectManager.addEffect(Effects.get('rotateToTarget'));
    }

    this.effectManager.addEffect(Effects.get('startMovement'));
    this.effectManager.addEffect(Effects.get('accelerateToTarget'));
    this.effectManager.addEffect(Effects.get('moveToTarget'));
    this.effectManager.addEffect(Effects.get('stopping'));
    this.effectManager.addEffect(Effects.get('resetMovement'));
    this.effectManager.addEffect(Effects.get('stopAnimation'));
  },

  /**
   * Resets all motion related effects and helper variables
   * from being effecting the given entity
   * @return {void}
   */
  reset() {
    this.effectManager.resetEffects();
  },

  /**
   * Terminate the entity from any further movement by applying a suitable drag on it
   * @return {void}
   */
  stop() {
    this.effectManager.resetEffects();
    this.effectManager.addEffect(Effects.get('stopping'));
    this.effectManager.addEffect(Effects.get('resetMovement'));
    this.effectManager.addEffect(Effects.get('stopAnimation'));
  },

  /**
   * Rotates the entity towards the given target that the activity returns
   * @return {void}
   */
  rotateToTarget(activity) {
    this.activity = activity;

    this.effectManager.resetEffects();
    this.effectManager.addEffect(Effects.get('initMovement'));

    if (this.isRequiredToStopBeforeFurtherAction()) {
      this.effectManager.addEffect(Effects.get('stopping'));
      this.effectManager.addEffect(Effects.get('resetMovement'));
    }

    this.effectManager.addEffect(Effects.get('rotateToTarget'));
  },

  /**
   * Makes the entity slowly floating up and down
   * @return {void}
   */
  levitate() {
    this.effectManager.addEffect(Effects.get('levitating'));
  },

  /**
   * Stops the floating animation
   */
  stopLevitating() {
    this.effectManager.resetEffects();
    this.entity.sprite.anchor.setTo(0.5, 0.5);
  },

  /**
   * Tick function for altering the helper variables that determines the effects
   * influence the entity object
   * @return {void}
   */
  update() {
    this.updateVelocity();
    this.updateRotation();
    this.effectManager.updateEffects();
    this.executeChecks();
  },

  /**
   * Updating the velocity according to the applied effects that can alter the coordinates of the Entity
   * @return {void}
   */
  updateVelocity() {
    this.movement.distance = this.game.physics.arcade.distanceToXY(
      this.sprite,
      this.movement.targetX,
      this.movement.targetY,
    );
    this.movement.distanceInverse =
      this.movement.targetInitialDistance - this.movement.distance;
    this.movement.distanceFromOrigin = this.game.physics.arcade.distanceToXY(
      this.sprite,
      this.movement.originX,
      this.movement.originY,
    );

    if (this.movement.acceleration) {
      this.movement.velocity +=
        this.movement.acceleration * this.game.time.physicsElapsed;
    } else if (this.movement.drag) {
      this.movement.drag *= this.game.time.physicsElapsed;
      if (this.movement.velocity - this.movement.drag > 0) {
        this.movement.velocity -= this.movement.drag;
      } else if (this.movement.velocity + this.movement.drag < 0) {
        this.movement.velocity += this.movement.drag;
      } else {
        this.movement.velocity = 0;
      }
    }

    if (this.movement.velocity > this.movement.maxVelocity) {
      this.movement.velocity = this.movement.maxVelocity;
    } else if (this.movement.velocity < -this.movement.maxVelocity) {
      this.movement.velocity = -this.movement.maxVelocity;
    }

    this.sprite.body.velocity.x =
      Math.cos(this.movement.currentAngle) * this.movement.velocity;
    this.sprite.body.velocity.y =
      Math.sin(this.movement.currentAngle) * this.movement.velocity;
  },

  /**
   * Updating the sprite's current frame according to the rotation details
   * @return {void}
   */
  updateRotation() {
    if (this.isMoving() && this.entity.hasSlowManeuverability()) {
      return;
    }

    if (this.rotation.currentAngleCode === this.rotation.targetAngleCode) {
      if (!this.isEntityHeadedToDestination) {
        this.isEntityHeadedToDestination = true;
        this.effectManager.addEffectToTop(Effects.get('startMoveAnimation'));
      }
      return;
    }

    if (this.hasRealManeuverSystem()) {
      const a = Phaser.Math.normalizeAngle(this.movement.targetAngle);
      const b = Phaser.Math.normalizeAngle(this.movement.currentAngle);
      const step =
        this.rotation.maxAngularVelocity / 10 * this.game.time.physicsElapsed;

      if (Math.abs(a - b) > step * 2) {
        if (!this.rotation.angularDirection) {
          this.rotation.angularDirection =
            (a - b >= 0 && a - b <= 180) || (a - b <= -180 && a - b >= -360)
              ? 1
              : -1;
        }
        this.movement.currentAngle += this.rotation.angularDirection * step;
      } else {
        this.movement.currentAngle = this.movement.targetAngle;
      }

      this.movement.targetAngle = Math.atan2(
        this.movement.targetY - this.sprite.y,
        this.movement.targetX - this.sprite.x,
      );
      this.rotation.targetAngleCode = this.getAngleCodeByAngle(this.movement.targetAngle);
      this.rotation.currentAngleCode = this.getAngleCodeByAngle(this.movement.currentAngle);

      if (this.rotation.maxAngleCount > 0) {
        this.sprite.frame = this.rotationFrames[this.rotation.currentAngleCode];
      }
    } else {
      this.movement.currentAngle = this.movement.targetAngle;
      this.rotation.angularDirection =
        this.rotation.stepNumberToLeft < this.rotation.stepNumberToRight
          ? -1
          : 1;

      this.rotation.angularVelocityHelper +=
        this.rotation.angularVelocity * this.game.time.physicsElapsed;
      if (this.rotation.angularVelocityHelper > 1) {
        this.rotation.angularVelocityHelper = 0;
        if (
          this.rotation.currentAngleCode + this.rotation.angularDirection <
          0
        ) {
          this.rotation.currentAngleCode = this.rotation.maxAngleCount;
        }
        this.rotation.currentAngleCode += this.rotation.angularDirection;
        this.rotation.currentAngleCode %= this.rotation.maxAngleCount;
      }

      if (this.rotation.maxAngleCount > 0) {
        this.sprite.frame = this.rotationFrames[this.rotation.currentAngleCode];
      }
    }
  },

  /**
   * Executes checks after altering the position of the given entity has been ran
   * @return {void}
   */
  executeChecks() {
    if (this.isEntityStoppedAtDestination) {
      if (this.activity) {
        this.activity.kill();
      }
      this.dispatcher.dispatch('arrive');
      this.isEntityStoppedAtDestination = false;
      this.isEntityArrivedAtDestination = false;
    }
  },

  /**
   * Calculates and returns the coordinates of a point
   * in front of the entity given its current rotation
   * @param {number} angleOffset - offset to the angle (defaults to 0)
   * @return {object} {x, y}
   */
  getFrontCollisionPointOffset(angleOffset = 0) {
    const angleCode = this.rotation.currentAngleCode + angleOffset;
    if (!this.collisionPoints[angleCode]) {
      const rad = this.movement.currentAngle;
      const nX = Math.max(this.sprite.hitArea.width, TILE_WIDTH);
      const nY = 0;

      const c = Math.cos(rad);
      const s = Math.sin(rad);

      const x = nX * c - nY * s;
      const y = nX * s + nY * c;
      this.collisionPoints[angleCode] = { x, y };
    }
    return this.collisionPoints[angleCode];
  },

  /**
   * Registers a callback to the given event
   * @param  {string} event
   * @param  {Function} callback
   * @return {void}
   */
  on(event, callback) {
    this.dispatcher.addEventListener(event, callback);
  },

  /**
   * Registers a callback to the given event that will be called only once
   * @param  {string} event
   * @param  {Function} callback
   * @return {void}
   */
  once(event, callback) {
    if (typeof callback !== 'function') {
      return;
    }
    this.dispatcher.addEventListener(
      event,
      function once() {
        callback();
        this.dispatcher.removeEventListener(event, once);
      }.bind(this),
    );
  },

  /**
   * Checks whether the entity is facing towards it's target
   * @param  {object} targetEntity
   * @return {boolean}
   */
  isEntityFacingTargetEntity(targetEntity) {
    const sprite = this.entity.getSprite();
    const targetSprite = targetEntity.getSprite();
    const targetAngle = Math.atan2(
      targetSprite.y - sprite.y,
      targetSprite.x - sprite.x,
    );
    const targetAngleCode = this.getAngleCodeByAngle(targetAngle);
    if (this.rotation.maxAngleCount < 2) return true;
    return this.rotation.currentAngleCode === targetAngleCode;
  },

  /**
   * Returns whether the entity is headed towards its target
   * @return {boolean}
   */
  isEntityFacingTarget() {
    return this.rotation.currentAngleCode === this.rotation.targetAngleCode;
  },

  /**
   * Returns whether the entity needs trigger the stop action
   * before having any further actions added to its motion queue
   * @return {boolean}
   */
  isRequiredToStopBeforeFurtherAction() {
    return (
      this.isMoving() &&
      !this.isEntityFacingTarget() &&
      this.entity.hasSlowManeuverability()
    );
  },

  /**
   * Returns whether the entity is moving in any direction
   * @return {boolean}
   */
  isMoving() {
    return this.movement.velocity > 0;
  },

  /**
   * Returns whether the entity has the real maneuver system activated
   * @returns {boolean}
   */
  hasRealManeuverSystem() {
    return this.rotation.realManeuverSystem;
  },

  /**
   * Returns the current angle code determined by the updateRotation method
   * @returns {integer} current angle code that usually goes from 0 to 15
   */
  getCurrentAngleCode() {
    return this.rotation.currentAngleCode;
  },

  /**
   * Returns the entity instance linked to the motion manager
   * @return {object} Entity
   */
  getEntity() {
    return this.entity;
  },

  /**
   * Returns the calculated target angle code according to the given angle
   * @oaram {float} targetAngle
   * @return {integer}
   */
  getAngleCodeByAngle(targetAngle) {
    const rotationOffset = Math.floor(this.rotation.maxAngleCount * 0.75);
    let calculatedAngle;

    if (this.rotation.maxAngleCount === 1) return 0;

    calculatedAngle = Phaser.Math.radToDeg(targetAngle);
    if (calculatedAngle < 0) {
      calculatedAngle = 360 - Math.abs(calculatedAngle);
    }
    return (
      (Math.floor(calculatedAngle / (360 / this.rotation.maxAngleCount)) +
        rotationOffset) %
      this.rotation.maxAngleCount
    );
  },

  /**
   * Returns the current angle code that scretches from 0 to MaxAngleCount
   * @return {integer} code of the current angle code
   */
  getCurrentAngleCode() {
    return this.rotation.currentAngleCode;
  },

  /**
   * Returns the current orientation of the entity in radian
   * @return {integer} orientation of the entity in radian
   */
  getCurrentAngleInRad() {
    return this.movement.currentAngle;
  },

  /**
   * Returns the current orientation of the entity in degree
   * @return {integer} orientation of the entity in degree
   */
  getCurrentAngleInDeg() {
    return (Phaser.Math.radToDeg(this.getCurrentAngleInRad()) + 270) % 360;
  },
};

export default MotionManager;
