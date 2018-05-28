import EffectManager from './EffectManager';
import Effects from './Effects';
import Move from '../activities/shared/Move';
import Util from '../../common/Util';
import { TILE_WIDTH, TILE_HEIGHT } from '../../common/Const';

const ns = window.fivenations;

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
  this.isFighter = this.entity.getDataObject().isFighter();
  this.isWorker = this.entity.getDataObject().isWorker();
  this.animationManager = entity.getAnimationManager();
  this.rotationFrames = createRotationFrames(entity);

  this.movement = createMovementObject(entity);
  this.rotation = createRotationObject(entity);
  this.levitation = createLevitationObject(entity);

  this.isEntityArrivedAtDestination = false;
  this.isEntityStoppedAtDestination = false;
  this.isEntityHeadedToDestination = false;

  this.isUsingPathFinding = false;

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
    stopping: false,
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
    maxAngleCount: dataObject.getDirections() || 1,
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
   */
  moveTo(activity) {
    // update usage of pathfinding algorythm
    this.isUsingPathFinding = this.isEmployingPathfinding();

    if (!this.isUsingPathFinding) {
      this.setUpEffectsForMoving(activity);
      return;
    }

    this.originalActivity = activity;

    const start = this.entity.getTileObj();
    const dest = activity.getTile();

    // async recoursive function to get the path to the
    // closest point of the given destination
    this.calculatePath(start, dest);
  },

  /**
   * Invokes EasyStarJs to asyncroniously calculate the path between
   * the given coordinates
   * @param {object} start - { x, y }
   * @param {object} dest - { x, y }
   */
  calculatePath(start, dest) {
    const collisionMap = ns.game.map.getCollisionMap();
    // calculate the shortest path between the entity and the given
    // target
    collisionMap.calculatePath(start, dest).then((path) => {
      // the calculation failed due to the destination is occupied
      // so we fire up another attempt next to it
      if (!path) {
        const attemptDest = dest;
        attemptDest.x += Math.floor(Math.random() * 4) - 2;
        attemptDest.y += Math.floor(Math.random() * 4) - 2;
        this.calculatePath(start, attemptDest);
        return;
      }

      // slice is due to the fact that the first tile is underneath the
      // entity and since it's already there we can get rid of it
      this.tilesToTarget = path.slice(1);
      this.moveToNextTile();
    });
  },

  /**
   * Sets up the effects to make the entity follow the next tile that
   * was calculated by the pathfinding algoritm
   */
  moveToNextTile() {
    if (!this.tilesToTarget || !this.tilesToTarget.length) return;

    const collisionMap = ns.game.map.getCollisionMap();
    const nextTile = this.tilesToTarget[0];
    const nextTileCoords = ns.game.map.getScreenCoordinatesOfTile(nextTile);
    const activity = new Move(this.entity);
    activity.setCoords(nextTileCoords);

    let stopWhenArrives = false;

    // when executing the last Move activity to the final tile
    // we make sure that the entity won't look for the next tile
    // and it does stop
    if (this.tilesToTarget.length === 1) {
      this.isUsingPathFinding = false;
      stopWhenArrives = true;
    }

    // This is used to suggest the entity its tile.
    // When the entity arrives at its destination we set
    // the suggested tile as this.lastTileToTarget
    this.lastTileToTarget = nextTile;

    // updates whether the current entity faces an obstacle
    // it is important to be updated here as the tile that is
    // checked against any obstacles is the nextTile above
    collisionMap.updateObstaclesForEntity(this.entity);

    this.setUpEffectsForMoving(activity, stopWhenArrives);
  },

  /**
   * Helper function to moveTo that collects all the required effects
   * and set them up in the appropriate order for making the entity change
   * its current position
   * @param {object} activity - Activity instance that is usually a MoveTo
   * @param {boolean} stopWhenArrives - if true the entity does stop when
   * arriving to the destination
   */
  setUpEffectsForMoving(activity, stopWhenArrives = true) {
    this._forceStopped = false;
    this.activity = activity;

    this.effectManager.resetEffects();
    this.effectManager.execute(Effects.get('initMovement'));

    if (this.isRequiredToStopBeforeFurtherAction()) {
      this.effectManager.addEffect(Effects.get('stopping'));
      this.effectManager.addEffect(Effects.get('resetMovement'));
    }

    if (this.isRequiredToRotateFirst()) {
      this.effectManager.addEffect(Effects.get('stopAnimation'));
      this.effectManager.addEffect(Effects.get('rotateToTarget'));
    }

    this.effectManager.addEffect(Effects.get('startMovement'));
    this.effectManager.addEffect(Effects.get('accelerateToTarget'));
    this.effectManager.addEffect(Effects.get('moveToTarget'));

    if (
      stopWhenArrives &&
      this.isRequiredToStopWhenArrivingAtTheDestination()
    ) {
      this.effectManager.addEffect(Effects.get('stopping'));
      this.effectManager.addEffect(Effects.get('resetMovement'));
      this.effectManager.addEffect(Effects.get('stopAnimation'));
    }
  },

  /**
   * Resets all motion related effects and helper variables
   * from being effecting the given entity
   * @return {void}
   */
  reset() {
    this.entity.setSuggestedTile(false);
    this._forceStopped = false;
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
   * Terminates all effects and make the entity stop
   *
   */
  forceStop() {
    this._forceStopped = true;
    this.effectManager.resetEffects();
    this.effectManager.addEffect(Effects.get('resetMovement'));
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
    // when entities with slow manouver ability are moving but not
    // facing the target closely
    if (
      this.isMoving() &&
      this.entity.hasSlowManeuverability() &&
      !this.isEntityFacingTargetRoughly()
    ) {
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

      // Determines the direction of the rotation
      if (Math.abs(a - b) > step * 2) {
        if (!this.rotation.angularDirection) {
          const target = {
            x: this.movement.targetX,
            y: this.movement.targetY,
          };
          const rotation = this.game.physics.arcade.angleBetween(
            this.sprite,
            target,
          );
          // Calculate difference between the current angle and rotation
          let delta = rotation - this.sprite.rotation;

          // Keep it in range from -180 to 180 to make the most efficient turns.
          if (delta > Math.PI) delta -= Math.PI * 2;
          if (delta < -Math.PI) delta += Math.PI * 2;

          this.rotation.angularDirection = delta > 0 ? 1 : -1;
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
   */
  executeChecks() {
    this.checkIfEntityHasArrivedAtDestination();
    this.checkIfEntityHasStoppedAtDestination();
    this.checkIfEntityIsBlockedByObstacle();
  },

  /**
   * Tests if the entity has already stopped at the target destination
   */
  checkIfEntityHasArrivedAtDestination() {
    if (this.isEntityArrivedAtDestination) {
      if (this.isUsingPathFinding) {
        // we suggest a tile for the entity
        this.setSuggestedTile(this.lastTileToTarget);
        this.tilesToTarget.shift();
        this.moveToNextTile();
      }
    }
  },

  /**
   * Tests if the entity has already stopped at the target destination
   */
  checkIfEntityHasStoppedAtDestination() {
    if (this.isEntityStoppedAtDestination) {
      // we suggest a tile for the entity
      this.setSuggestedTile(this.lastTileToTarget);
      // when the entity utilizes EasyStarJs it overwrites the activity
      // instance with separate Move Activities to each of the tiles
      // that EasyStarJs calculates, so we've got to kill the original
      // activity instead
      if (this.originalActivity && this.originalActivity.isKillable()) {
        this.originalActivity.kill();
      } else if (this.activity && this.activity.isKillable()) {
        this.activity.kill();
      }
      this.dispatcher.dispatch('arrive');
      this.isEntityStoppedAtDestination = false;
      this.isEntityArrivedAtDestination = false;
    }
  },

  /**
   * Tests if there is an obstacle in front of the entity and therefore
   * it must terminate the currently executed motion effect
   */
  checkIfEntityIsBlockedByObstacle() {
    // no checking for Fighters
    if (this.isFighter) return;
    // the entity stands still and it hasn't been blocked yet
    if (!this.isMoving() && !this._forceStopped) return;
    // if the entity is not blocked by an obsticle ahead
    if (!this.entity.isObstacleAhead()) {
      // although the entity is not blocked anymore, but if it has been
      // force stopped and there is no obstacles in the way anyore
      if (this._forceStopped && this.activity) {
        // if the entity using pathfanding the current activity
        // is a Move Activity that represent moving towards the next tile
        if (this.isUsingPathFinding) {
          // we must reset the current activity to the original one that
          // was saved when the pathfinding got kicked off
          this.activity = this.originalActivity;
        }
        this.moveTo(this.activity);
      }
    } else if (!this._forceStopped) {
      // obstacle is ahead - execute force stop
      this.forceStop();
      // retrigger the pathfinding that will now update the route
      // according to the obstacle ahead
      if (this.isUsingPathFinding) {
        this.moveTo(this.originalActivity);
      }
    }
  },

  /**
   * Sets a suggested tile for the entity
   * @param {object} tile - {x, y}
   */
  setSuggestedTile(tile) {
    this.entity.setSuggestedTile(tile);
  },

  /**
   * Calculates and returns the coordinates of a point
   * in front of the entity given its current rotation
   * @param {number} angleOffset - offset to the angle (defaults to 0)
   * @return {object} {x, y}
   * @deprecated
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
   * Returns if the entity is headed more or less towards its target.
   * This is used to prevent entities to stop every time when the
   * angle between them and their targets differ
   * @return {boolean} true if the diff between the angleCodes is less then 90 degrees
   */
  isEntityFacingTargetRoughly() {
    const { targetAngleCode, currentAngleCode, maxAngleCount } = this.rotation;
    const diff = Util.getDiffBetweenRadialValues(
      targetAngleCode,
      currentAngleCode,
      maxAngleCount,
    );
    const treshold = Math.floor(maxAngleCount / 4); // one quarter of a round
    return diff < treshold;
  },

  /**
   * Returns whether the entity needs trigger the stop action
   * before having any further actions added to its motion queue
   * @return {boolean}
   */
  isRequiredToStopBeforeFurtherAction() {
    return (
      this.isMoving() &&
      !this.isEntityFacingTargetRoughly() &&
      this.entity.hasSlowManeuverability()
    );
  },

  /**
   * Returns true if the entity is not needed to rotate before it
   * executes further effects
   * @return {boolean}
   */
  isRequiredToRotateFirst() {
    if (this.isEntityFacingTarget()) return false;
    if (this.hasRealManeuverSystem()) {
      if (!this.entity.isObstacleAhead()) return false;
    }
    // the entity is not facing the target or there is an
    // obstacle ahead regardless current the manouver system
    return true;
  },

  /**
   * Returns if the entity must stop when arriving to its destination.
   * It is mostly used to avoid interruptions (repeated stop-and-go)
   * when the next target is situated in a way that the entity can carry on
   * moving without changing direction.
   * @return {boolean}
   */
  isRequiredToStopWhenArrivingAtTheDestination() {
    return true;
  },

  /**
   * Returns whether the entity is moving in any direction
   * @return {boolean}
   */
  isMoving() {
    return this.movement.velocity > 0;
  },

  /**
   * Returns whether the entity is stopping
   * @return {boolean}
   */
  isStopping() {
    return this.movement.stopping;
  },

  /**
   * Returns true if the entity uses the pathfinding logic to
   * move to its target coordinates
   * @returns {boolean}
   */
  isEmployingPathfinding() {
    return !(this.isFighter || this.isWorker);
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

  /**
   * Returns the maximum count of separate angle states
   * @return {number}
   */
  getMaxAngleCount() {
    return this.rotation.maxAngleCount;
  },

  /**
   * Returns an array of tile coordinates
   * @return {object} array of tile coordinates that leads to the
   * target destination with no collision involved
   */
  getTilesToTarget() {
    return this.tilesToTarget;
  },

  /**
   * Return the next tile towards the target calculated by EasyStarJs
   * @return {object} { x, y }
   */
  getNextTileToTarget() {
    if (!this.tilesToTarget || !this.tilesToTarget.length) return null;
    return this.tilesToTarget[0];
  },
};

export default MotionManager;
