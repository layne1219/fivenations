import Shorthand from './Shorthand';
import PlayerManager from '../../players/PlayerManager';

class Mine extends Shorthand {
  /**
   * Executes the bound logic
   * @param {object} manager - ShorthandManager instance
   */
  execute(manager) {
    const selectedEntities = manager.getSelectedEntities();
    const resetActivityQueue = manager.willActivityQueueReset();
    const targetEntity = manager.getTargetEntity();

    this.getEventEmitter(selectedEntities).mine({
      targetEntity,
      resetActivityQueue,
    });

    targetEntity.selectedAsTarget();
  }

  /**
   * Returns true if the shorthand must be executed
   * @param {object} manager - ShorthandManager instance
   * @return {boolean}
   */
  test(manager) {
    const selectedEntities = manager.getSelectedEntities();
    const playerManager = PlayerManager.getInstance();
    const targetEntity = manager.getTargetEntity();
    // if there is no target selected
    if (!targetEntity) return false;

    // if there is at least one unit that cannot dock
    if (selectedEntities.some(entity => !entity.canMine())) return false;

    // if the selected entity does not have hanger capacity
    if (!targetEntity.isMinable()) return false;
    return true;
  }
}

export default Mine;
