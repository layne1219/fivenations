import Activity from '../Activity';
import PlayerManager from '../../../players/PlayerManager';
import EventEmitter from '../../../sync/EventEmitter';
import Util from '../../../common/Util';

const ns = window.fivenations;

// animation key
const PRODUCTION_ANIMATION_KEY = 'construction';

class Produce extends Activity {
  /**
   * Applies the activity on an entity
   */
  activate() {
    super.activate();
    this.startProductionAnimation();
    this.setComplitionTime();
  }

  /**
   * Starts the animation sequence
   */
  startProductionAnimation() {
    this.entity.startAnimation(PRODUCTION_ANIMATION_KEY);
  }

  /**
   * Stops the animation sequence
   */
  stopProductionAnomation() {
    this.entity.stopAnimation();
  }

  /**
   * Calculates the timestamp at which the production must be
   * completed
   */
  setComplitionTime() {
    const time = ns.game.game.time.time;
    const getProductionLengthInMs = this.targteDO.buildingTime * 1000;
    this.complitionTime = time + getProductionLengthInMs;
  }

  /**
   * Dispatches a Universal event to create the designated entity
   */
  createEntity() {
    // calculates the coordinets of the nearby empty tile where
    // the icarus will be placed
    const collisionMap = ns.game.map.getCollisionMap();
    const tile = collisionMap.getFirstEmptyTileNextToEntity(this.entity);
    const x = tile.x * TILE_WIDTH;
    const y = tile.y * TILE_HEIGHT;
    const team = this.entity.getDataObject().getTeam();
    const emitter = EventEmitter.getInstance();
    emitter.synced.entities.add({
      id: this.targetDO.id,
      team,
      x,
      y,
    });
  }

  /**
   * Updates the activity on every tick
   */
  update() {
    const now = ns.game.game.time.time;
    if (now >= this.complitionTime) {
      this.stopProductionAnomation();
      this.createEntity();
      this.kill();
    }
  }

  /**
   * Saves the target entity that will be attacked
   */
  setTarget(entity) {
    this.target = entity;
    this.targteDO = phaserGame.cache.getJSON(this.target);
  }

  /**
   * Returns the timestamp of by when the production must be done
   * @return {number}
   */
  getComplitionTime() {
    return this.complitionTime;
  }
}

export default Mine;
