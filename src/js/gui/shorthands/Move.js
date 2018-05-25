import EventEmitter from '../../sync/EventEmitter';
import Shorthand from './Shorthand';

class Move extends Shorthand {
  /**
   * Executes the bound logic
   */
  execute(manager) {
    const eventEmitter = EventEmitter.getInstance();
    const resetActivityQueue = manager.willActivityQueueReset();
    const { x, y } = this.getCoords();

    eventEmitter.synced.entities(':user:selected:not(building)').move({
      x,
      y,
      resetActivityQueue,
    });

    this.displayClickAnimation(x, y);
  }
}

export default Move;
