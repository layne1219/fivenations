import Shorthand from './Shorthand';
import PlayerManager from '../../players/PlayerManager';

class Follow extends Shorthand {
  /**
   * Executes the bound logic
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
   * @return {boolean}
   */
  test() {
    const playerManager = PlayerManager.getInstance();
    return !playerManager.isEntityHostileToPlayer(
      targetEntity,
      playerManager.getUser(),
    );
  }
}

export default Follow;
