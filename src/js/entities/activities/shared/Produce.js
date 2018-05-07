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
   * Calculates the timestamp at whitch the production must be
   * completed
   */
  setComplitionTime() {
    const time = ns.game.game.time.time;
    const dataSource = phaserGame.cache.getJSON(this.target);
    const getProductionLengthInMs = dataSource.buildingTime * 1000;
    this.complitionTime = time + getProductionLengthInMs;
  }

  /**
   * Dispatches a Universal event to create the designated entity
   */
  createEntity() {}

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
   * @return {[void]}
   */
  setTarget(entity) {
    this.target = entity;
  }
}

export default Mine;
