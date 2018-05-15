import PlayerManager from '../../players/PlayerManager';
import EventEmitter from '../../sync/EventEmitter';
import { TILE_WIDTH, TILE_HEIGHT } from '../../common/Const';

const ns = window.fivenations;

const PRODUCTION_ANIMATION_KEY = 'construction';

class ProductionManager {
  constructor(entity) {
    this.entity = entity;
    this.slots = [];
  }

  /**
   * Updates the current production queue at every tick. It creates
   * the determined entity when the production time passes by
   */
  update() {
    if (!this.isProducing()) {
      return;
    }

    if (this.hasProductionStarted()) {
      if (this.isProductionReady()) {
        this.createEntityFromCurrentSlot();
        this.removeProductionSlotByIndex(0);
      }
    } else {
      this.startProduction();
      this.startAnimation();
    }
  }

  /**
   * Extends the production queue of the entity
   * @param {object} slot - { id, time }
   */
  addProductionSlot(slot) {
    this.slots.push(slot);
    this.updateControlPage();
  }

  /**
   * Removes a production slot by the given index number
   */
  removeProductionSlotByIndex(idx) {
    if (!this.slots[idx]) return;
    this.slots.splice(idx, 1);
    if (idx === 0) {
      this.stopAnimation();
      this.updateControlPage();
    }
  }

  /**
   * Notifies the ControlPage instances that they must be updated
   * due to change in the production tab
   */
  updateControlPage() {
    const emitter = EventEmitter.getInstance();
    emitter.local.dispatch('gui/controlpage/update');
  }

  /**
   * Dispatches a Universal event to create the designated entity
   * @param {string} id - Id of the entity product
   */
  createEntityFromCurrentSlot() {
    const id = this.slots[0].id;
    const manager = PlayerManager.getInstance();
    // only for authorised players
    if (!manager.isUserAuthorised()) return;
    // calculates the coordinets of the nearby empty tile where
    // the icarus will be placed
    const collisionMap = ns.game.map.getCollisionMap();
    const tile = collisionMap.getFirstEmptyTileNextToEntity(this.entity);
    const x = tile.x * TILE_WIDTH;
    const y = tile.y * TILE_HEIGHT;
    const team = this.entity.getDataObject().getTeam();
    const emitter = EventEmitter.getInstance();
    emitter.synced.entities.add({
      id,
      team,
      x,
      y,
    });
  }

  /**
   * Starts the production with setting up all the required
   * helper variables
   */
  startProduction() {
    const current = this.slots[0];
    const now = ns.game.game.time.time;
    current.activated = true;
    current.complitionTime = now + current.time;
  }

  /**
   * Starts the animation sequence
   */
  startAnimation() {
    this.entity.animate(PRODUCTION_ANIMATION_KEY);
  }

  /**
   * Stops the animation sequence
   * Augments the production queue of the given target
   */
  stopAnimation() {
    this.entity.stopAnimation();
  }

  /**
   * Returns true if the the queue is not empty
   * @return {boolean}
   */
  isProducing() {
    return this.slots.length;
  }

  /**
   * Returns whether the production is ready
   * @returns {boolean}
   */
  isProductionReady() {
    const now = ns.game.game.time.time;
    const current = this.slots[0];
    return current.complitionTime <= now;
  }

  /**
   * Returns true if the production has been started
   * @return {boolean}
   */
  hasProductionStarted() {
    return this.slots[0].activated;
  }

  /**
   * Returns the first slot that is being produced
   * @return {object}
   */
  getCurrentProductionSlot() {
    return this.slots[0];
  }

  /**
   * Returns all the slots in the production queue
   * @return {object}
   */
  getAllSlots() {
    return this.slots;
  }
}

export default ProductionManager;
