import Activity from './Activity';
import PlayerManager from '../../players/PlayerManager';
import EventEmitter from '../../sync/EventEmitter';
import Util from '../../common/Util';

const ns = window.fivenations;
const dogFightDistanceTreshold = 100;
const dogFightCoords = [
  {
    x: -0.4,
    y: -0.4,
  },
  {
    x: 0.4,
    y: -0.4,
  },
  {
    x: 0.4,
    y: 0.4,
  },
  {
    x: -0.4,
    y: 0.4,
  },
];

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

    // gracefully cleans up the activity when the target is removed
    this.onTargetEntityRemove = () => this.kill();
  }

  /**
   * Applying the activity on an entity
   * @return {[void]}
   */
  activate() {
    super.activate();

    if (this._firstExecution && this.isTargetInMinRange()) {
      this._firstExecution = false;
      this.entity.stop();
    }
    has;
    // executes the undock activity against all docked entities
    // and makes them attack the current target
    this.releaseDockedEntities();
  }

  /**
   * Updates the activity on every tick
   */
  update() {
    // if the target cannot be attacked the activity gets destroyed
    if (!this.target.isTargetableByEntity(this.entity)) {
      const dispatcher = EventEmitter.getInstance().local;
      dispatcher.dispatch('attack/invalid-target');
      this.kill();
      return;
    }

    // unshifts GetInRange Activiy to the Activity queue if the entity
    // hasn't arrived at the distance where its weapon with the smallest range
    // can be fired
    if (!this.isTargetInMinRange() && !this.isWeaponReadyToFireTarget()) {
      this.entity.getInRange(this.target);
      return;
    }

    // DogFight logic makes entities to select coordinates
    // around their target entity and move their while the
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
   * Checks whether the specified target entity is in range
   * @return {boolean}
   */
  isTargetInMinRange() {
    let distance;
    let range;

    distance = Util.distanceBetween(this.entity, this.target);
    range = this.entity.getWeaponManager().getMinRange();

    return distance <= range;
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
    const targetSprite = this.target.getSprite();
    let offset;

    if (this._dogFightCoordIdx === -1) {
      // uses creation time to simulate randomness
      this._dogFightCoordIdx = this.entity.getCreationTime();
    } else {
      this._dogFightCoordIdx += 1;
    }

    this._dogFightCoordIdx %= dogFightCoords.length;
    offset = dogFightCoords[this._dogFightCoordIdx];

    return {
      x: targetSprite.x + targetSprite.width * offset.x,
      y: targetSprite.y + targetSprite.height * offset.y,
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

    if (!authorised || !dockedEntities || !dockedEntities.length) return;

    emitter(this.entity).undock();
    emitter(dockedEntities)
      .attack({
        targetEntity: this.target,
        addAsLast: true,
      })
      .getToDock({
        targetEntity: this.entity,
        addAsLast: true,
      });
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
   * Returns true if the entity currently has any releasable weapon
   * @return {boolean}
   */
  isWeaponReadyToFireTarget() {
    return this.entity.getWeaponManager().isWeaponReadyToFireTarget();
  }
}

export default Attack;
