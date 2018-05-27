import GUI from '../GUI';

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
    return UserPointer.getInstane().getRealCoords();
  }
}

export default Move;
