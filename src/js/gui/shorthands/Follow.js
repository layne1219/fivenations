import Shorthand from './Shorthand';
import PlayerManager from '../../players/PlayerManager';

class Follow extends Shorthand {
  /**
   * Executes the bound logic
   * @param {object} manager - ShorthandManager instance
   */
  execute(manager) {
    const selectedEntities = manager.getSelectedEntities();
    const resetActivityQueue = manager.willActivityQueueReset();
    const targetEntity = manager.getTargetEntity();

    selectedEntities.follow({
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
    const targetEntity = manager.getTargetEntity();
    if (!targetEntity) return false;
    const playerManager = PlayerManager.getInstance();
    return !playerManager.isEntityHostileToPlayer(
      targetEntity,
      playerManager.getUser(),
    );
  }
}

export default Follow;
