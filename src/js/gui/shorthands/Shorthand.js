import GUI from '../GUI';
import UserPointer from '../UserPointer';
import EventEmitter from '../../sync/EventEmitter';

class Shorthand {
  /**
   * Executes the bound logic
   */
  execute(manager) {}

  /**
   * Returns true if the shorthand must be executed
   * @return {boolean}
   */
  test() {
    return true;
  }

  /**
   * Display the standard Click anim above the user pointer
   * @param {number} x
   * @param {number} y
   */
  displayClickAnimation(x, y) {
    const gui = GUI.getInstance();
    gui.putClickAnim(x, y);
  }

  /**
   * Returns the coordinates of the Mouse Pointer
   * @return {object} { x, y }
   */
  getCoords() {
    return UserPointer.getInstance().getRealCoords();
  }

  /**
   * Returns the EventEmitter wrapped around the given entities
   * @param {object} entities - Array of Entity instances
   * @return {object} EventEmitter.synced.entities(entitites)
   */
  getEventEmitter(entities) {
    const eventEmitter = EventEmitter.getInstance();
    return this.eventEmitter.synced.entities(entities);
  }
}

export default Shorthand;
