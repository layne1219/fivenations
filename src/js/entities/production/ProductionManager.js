import PlayerManager from '../../players/PlayerManager';
import EventEmitter from '../../sync/EventEmitter';
import { TILE_WIDTH, TILE_HEIGHT } from '../../common/Const';

const ns = window.fivenations;

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
    const current = this.slots[0];
    if (!current) return;

    const now = ns.game.game.time.time;

    if (current.activated) {
      if (now >= current.complitionTime) {
        this.createEntity(current.id);
        this.removeProductionSlotByIndex(0);
      }
    } else {
      current.activated = true;
      current.complitionTime = now + current.time;
    }
  }

  /**
   * Extends the production queue of the entity
   * @param {object} slot - { id, time }
   */
  addProductionSlot(slot) {
    this.slots.push(slot);
  }

  /**
   * Removes a production slot by the given index number
   */
  removeProductionSlotByIndex(idx) {
    if (!this.slots[idx]) return;
    this.slots.splice(idx, 1);
  }

  /**
   * Dispatches a Universal event to create the designated entity
   * @param {string} id - Id of the entity product
   */
  createEntity(id) {
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
   * Returns true if the the queue is not empty
   */
  isProducing() {
    return this.slots.length;
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
