import Activity from '../Activity';
import PlayerManager from '../../../players/PlayerManager';
import EffectManager from '../../../effects/EffectManager';
import EventEmitter from '../../../sync/EventEmitter';
import Util from '../../../common/Util';

const ns = window.fivenations;

// states of the CreateConstructionSite Actvity
const INACTIVE = 0;
const GO_TO_CONCSTRUCTION_SITE = 1;
const CREATE_CONSTRUCTION_SITE = 2;

class CreateConstructionSite extends Activity {
  /**
   * Generates a CreateConstructionSite activity instance
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    super(entity);

    // shorthands to optimise function calls
    this.motionManager = entity.getMotionManager();
    this.effectManager = EffectManager.getInstance();

    // the minimum range
    this._minRange = 50;

    // default state
    this.state = GO_TO_CONCSTRUCTION_SITE;

    // rainbow table of available states
    this.states = {
      [GO_TO_CONCSTRUCTION_SITE]: this.goToConstructionSite.bind(this),
      [CREATE_CONSTRUCTION_SITE]: this.createConstructionSite.bind(this),
    };
  }

  /**
   * Applies the activity on an entity
   */
  activate() {
    super.activate();
  }

  /**
   * Makes the entity get in range to the construction site
   */
  goToConstructionSite() {
    if (!this.isConstructionSiteInMinRange()) {
      this.entity.moveToEntity(this.target);
    }

    // If the entity is in the mininmum range but it's still moving
    // for any reason
    if (this.motionManager.isMoving() && !this.motionManager.isStopping()) {
      this.entity.stop().then(() => {
        // make a transition to the next state
        this.setState(CREATE_CONSTRUCTION_SITE);
      });
    }
  }

  /**
   * Makes the entity begin the mining process
   */
  createConstructionSite() {
    const manager = PlayerManager.getInstance();

    // !!! executed for only authorised users
    if (!manager.isUserAuthorised()) return;

    // emit smoke effect locally only
    this.emitEffects();

    // creates an entity
    this.createsEntity();
  }

  /**
   * Creates the actually building entity
   */
  createEntity() {
    const team = this.entity.getDataObject().getTeam();
    const { x, y } = this.placementCoords;

    emitter.synced.entities.add({
      id: this.entityId,
      team,
      x,
      y,
    });
  }

  /**
   * Generates effects to perk up the mining animation
   */
  emitEffects() {
    // emitting effects just locally since this is not required
    // to be syncronised as it does not have impact on the game
    this.effectManager.add({
      id: 'smoke-trail-1',
      x: this.entity.getSprite().x + Util.rnd(0, 10) - 5,
      y: this.entity.getSprite().y + Util.rnd(0, 10) - 5,
    });
  }

  /**
   * Updates the activity on every tick
   */
  update() {
    // invokes the functionality that is bound to the current state,
    // this is executed at every tick
    this.states[this.state]();
  }

  /**
   * Helper function to wrap setting the state into one context
   */
  setState(state) {
    this.state = state;
  }

  /**
   * Sets the id of the entity that will be constructed
   */
  setEntityId(entityId) {
    this.entityId = entityId;
  }

  /**
   * Sets the coordinates of the construction site
   */
  setConstructionSiteCoords(placementCoords) {
    this.placementCoords = placementCoords;
  }

  /**
   * Sets the tiles of the construction site
   */
  setConstructionSiteTileCoords(coords) {
    this.tileCoords = coords;
  }

  /**
   * Checks whether the target resource entity is in range
   * @return {boolean}
   */
  isConstructionSiteInMinRange() {
    const distance = Util.distanceBetween(this.entity, this.target);
    return distance <= this._minRange;
  }
}

export default CreateConstructionSite;
