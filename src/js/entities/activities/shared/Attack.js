import Activity from '../Activity';
import PlayerManager from '../../../players/PlayerManager';
import EventEmitter from '../../../sync/EventEmitter';
import Util from '../../../common/Util';
import { TILE_WIDTH, TILE_HEIGHT } from '../../../common/Const';

const ns = window.fivenations;

const rangeTooFarFactor = 1.5;

const dogFightDistanceTreshold = 50;

class Attack extends Activity {
  /**
   * Generates an Attack activity instance
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super();

    this.entity = entity;
    this.motionManager = entity.getMotionManager();
    this._firstExecution = true;

    // Helper variables for the DogFight logic
    this._dogFight = this.entity.getDataObject().isFighter();
    // -1 means that there is no selected DogFight coordinate just yet
    this._dogFightCoordIdx = -1;

    // helper variable to avoid calculating the distance between
    // the main and target entity more than once per tick
    this._distance = 0;

    // the minimum range
    this._minRange = this.entity.getWeaponManager().getMinRange();

    // the range value that is deemed too far
    this._rangeTooFar =
      this.entity.getWeaponManager().getMaxRange() * rangeTooFarFactor;

    // gracefully cleans up the activity when the target is removed
    this.onTargetEntityRemove = () => this.kill();
    this.onCarrierEntityRemove = () => {
      this.carrierEntity = null;
    };
  }

  /**
   * Applying the activity on an entity
   * @return {[void]}
   */
  activate() {
    super.activate();

    this.calculateDistance();

    if (this._firstExecution && this.isTargetInMinRange()) {
      this._firstExecution = false;
      this.entity.stop();
    }
    // executes the undock activity against all docked entities
    // and makes them attack the current target
    this.releaseDockedEntities();
  }

  /**
   * Calculates the distance between the given and target entity
   */
  calculateDistance() {
    this._distance = Util.distanceBetween(this.entity, this.target);
  }

  /**
   * Updates the activity on every tick
   */
  update() {
    this.releaseDockedEntities();

    // if the target cannot be attacked the activity gets destroyed
    if (!this.target.isTargetableByEntity(this.entity)) {
      const dispatcher = EventEmitter.getInstance().local;
      dispatcher.dispatch('attack/invalid-target');
      this.kill();
      return;
    }

    // if the entity has a carrier entity attached to it and it is out of
    // range
    if (this.isCarrierEntityOutOfRange()) {
      this.kill();
      return;
    }

    // calculates the distance betwen the given and target entity
    // and saves it into a local helper variable for optimisation
    this.calculateDistance();

    // unshifts GetInRange Activiy to the Activity queue if the entity
    // hasn't arrived at the distance where its weapon with the smallest range
    // can be fired
    if (!this.isTargetInMinRange() && !this.isWeaponReadyToFireTarget()) {
      if (this.hasTargetGottenToFar()) {
        this.entity.stop();
        this.kill();
      } else {
        this.entity.getInRange(this.target, this._hasBeenInRangeOnce);
      }
      return;
    }

    // marks the entity so that we now it has been in range at least once
    this._hasBeenInRangeOnce = true;

    // DogFight logic makes entities to select coordinates
    // around their target entity and fly around it while the
    // Attack activity is being executed
    if (this.isDogFightEnabled()) {
      // _dogFightCoordIdx === -1 indicates the first execution of
      // the logic whilst we assign a coordinate to the entity
      // straightaway
      if (this._dogFightCoordIdx === -1) {
        this.moveToNextDogFightCoordinate();
      } else {
        // otherwise we wait until the coordinate is approached and
        // then assign it
        const distanceToTargetCoords = Util.distanceBetweenEntityAndCoords(
          this.entity,
          this._dogFightCoords,
        );
        if (distanceToTargetCoords < dogFightDistanceTreshold) {
          this.moveToNextDogFightCoordinate();
        }
      }
    } else {
      if (this.motionManager.isMoving()) {
        this.entity.stop();
        return;
      }

      if (!this.isEntityFacingTarget()) {
        this.entity.rotateToTarget(this.target);
      }
    }
  }

  /**
   * Makes the entity to move to the given coordinate without
   * registering another activity. That is helpful to implement
   * entity behaviour that requiest the entity to move during the attack
   */
  moveTo(coords) {
    this.coords = coords;
    this.entity.getMotionManager().moveTo(this);
  }

  kill() {
    this.entity.getWeaponManager().clearTargetEntity();
    super.kill();
  }

  /**
   * Saving the target entity that will be attacked
   * @return {[void]}
   */
  setTarget(entity) {
    if (!entity) {
      throw 'Invalid entity is passed to be followed!';
    }

    if (this.target) {
      this.target.off('remove', this.onTargetEntityRemove);
    }

    this.target = entity;
    this.target.on('remove', this.onTargetEntityRemove);
  }

  /**
   * Saving the carrier entity that will be attacked
   * @return {[void]}
   */
  setCarrierEntity(entity) {
    if (!entity) return;

    if (this.carrierEntity) {
      this.carrierEntity.off('remove', this.onCarrierEntityRemove);
    }

    this.carrierEntity = entity;
    this.carrierEntity.on('remove', this.onCarrierEntityRemove);
  }

  /**
   * Checks whether the specified target entity is in range
   * @return {boolean}
   */
  isTargetInMinRange() {
    return this._distance <= this._minRange;
  }

  /**
   * Checks whether the specified target entity is facing
   * the given target entity
   * @return {boolean}
   */
  isEntityFacingTarget() {
    return this.motionManager.isEntityFacingTargetEntity(this.target);
  }

  /**
   * Returns whether the given entity is able to execute
   * the so called "DogFight" attack style that makes the entity
   * flying around the target while the attack activity is being executed
   * @return {boolean} returns whether the entity is able to DogFight
   */
  isDogFightEnabled() {
    return this._dogFight;
  }

  /**
   * Returns true if the entity has been targetet at least once, but
   * now it's gotten too far to continue the attack activity
   * @return {boolean}
   */
  hasTargetGottenToFar() {
    if (!this._hasBeenInRangeOnce) return false;
    return this._distance >= this._rangeTooFar;
  }

  /**
   * Makes the entity move to the next dog fight coordinates
   */
  moveToNextDogFightCoordinate() {
    this._dogFightCoords = this.getNextDogFightCoordinate();
    this.entity.getMotionManager().moveTo(this);
  }

  /**
   * Determines and returns the next DogFight coordinate around
   * the target entity.
   * @return {object} object containing {x, y} coordinates
   */
  getNextDogFightCoordinate() {
    const { x, y, hitArea } = this.target.getSprite();
    return {
      x: x - hitArea.width / 2,
      y: y - hitArea.height / 2,
    };
  }

  /**
   * Releases all docked entities and make them attack the current
   * target Entity. It emits an entity/undock universal event and
   * subsequently the entity/attack
   */
  releaseDockedEntities() {
    const dockedEntities = this.entity.getDockedEntities();
    const authorised = PlayerManager.getInstance()
      .getUser()
      .isAuthorised();
    const emitter = EventEmitter.getInstance().synced.entities;

    // only if the user is authorised and the entity has docked
    // fighters in the hanger
    if (
      !authorised ||
      !dockedEntities ||
      !dockedEntities.length ||
      this._entitiesWillBeReleased
    ) {
      return;
    }

    // do not do pre-mature release, only when the carrier entity
    // has approached the target closely enough
    if (!this.isTargetInMinRange()) return;

    emitter(this.entity)
      .undock()
      .then(() => {
        // enable further execution of the release
        this._entitiesWillBeReleased = false;
      });

    emitter(dockedEntities)
      .attack({
        targetEntity: this.target,
        addAsLast: true,
        carrierEntity: this.entity,
      })
      .getToDock({
        targetEntity: this.entity,
        addAsLast: true,
      });

    // block any potential dupliation of the events above until
    // the Undock Activity is fully completed
    this._entitiesWillBeReleased = true;
  }

  /**
   * Returns if the entity has a carrier entity registered and that is
   * currently out of its range
   * @return {boolean}
   */
  isCarrierEntityOutOfRange() {
    if (!this.carrierEntity) return false;
    const distance = Util.distanceBetween(this.entity, this.carrierEntity);
    const range = this.carrierEntity.getWeaponManager().getMinRange();
    return distance > range;
  }

  /**
   *  Returns the current target DogFight coordinates
   * @return {object} {x, y}
   */
  getCurrentDogFightCoords() {
    return this._dogFightCoords;
  }

  /**
   * Returns the coordinates to which the entity is heading. It is only
   * used if the entity executes the DogFight logic while attacking
   * @return {object} {x, y}
   */
  getCoords() {
    return this._dogFightCoords;
  }

  /**
   * Returns the tile of the destination
   * @return {object} { x, y }
   */
  getTile() {
    return {
      x: Math.floor(this._dogFightCoords.x / TILE_WIDTH),
      y: Math.floor(this._dogFightCoords.y / TILE_HEIGHT),
    };
  }

  /**
   * Returns true if the entity currently has any releasable weapon
   * @return {boolean}
   */
  isWeaponReadyToFireTarget() {
    return this.entity.getWeaponManager().isWeaponReadyToFireTarget();
  }
}

export default Attack;
