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
    const { id } = this.targetDO;
    const time = this.getBuildingTime();
    manager.addProductionSlot({ id, time });
  }

  /**
   * Calculates the timestamp at which the production must be
   * completed
   */
  getBuildingTime() {
    return this.targteDO.buildingTime * 1000;
  }

  /**
   * Saves the id of the entity that will be produced
   */
  setTarget(entityIdToBeProduced) {
    this.targteDO = phaserGame.cache.getJSON(entityIdToBeProduced);
  }
}

export default Mine;
