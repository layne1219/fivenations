import Shorthand from './Shorthand';
import PlayerManager from '../../players/PlayerManager';

class Dock extends Shorthand {
  /**
   * Executes the bound logic
   * @param {object} manager - ShorthandManager instance
   */
  execute(manager) {
    const selectedEntities = manager.getSelectedEntities();
    const resetActivityQueue = manager.willActivityQueueReset();
    const targetEntity = manager.getTargetEntity();

    this.getEventEmitter(selectedEntities).getToDock({
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
    if (selectedEntities.some(entity => !entity.canDock())) return false;

    // if the selected entity is not friendly
    if (
      !playerManager.isEntityHostileToPlayer(
        targetEntity,
        playerManager.getUser(),
      )
    ) {
      return false;
    }
    // if the selected entity does not have hanger capacity
    if (!targetEntity.isDockable()) return false;
    return true;
  }
}

export default Dock;
