import Activity from '../Activity';
import Util from '../../../common/Util';

const ns = window.fivenations;

class Produce extends Activity {
  /**
   * Applies the activity on an entity
   */
  activate() {
    super.activate();
    this.addProductionSlot();
    this.kill();
  }

  /**
   * Augments the production queue of the given target
   */
  addProductionSlot() {
    const manager = this.entity.getProductionManager();
    manager.addProductionSlot({
      id: this.targetDO.id,
      time: this.getTime(),
    });
  }

  /**
   * Calculates the timestamp at which the production must be
   * completed
   */
  getTime() {
    return this.targteDO.buildingTime * 1000;
  }

  /**
   * Saves the target entity that will be attacked
   */
  setTarget(entity) {
    this.target = entity;
    this.targteDO = phaserGame.cache.getJSON(this.target);
  }
}

export default Mine;
