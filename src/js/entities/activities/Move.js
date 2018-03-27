import Activity from './Activity';

class Move extends Activity {
  /**
   * Constructor function to Move
   * @param  {[object]} entity Instance of an Entity class
   * @return {[object]}
   */
  constructor(entity) {
    super();
    this.entity = entity;
    this.coords = {};
  }

  /**
   * Applying the activity on an entity
   * @return {[void]}
   */
  activate() {
    super.activate();

    if (!this.entity.canMove()) {
      this.kill();
      return;
    }

    if (this.entity) {
      this.entity.getMotionManager().moveTo(this);
    }
  }

  /**
   * Saving the target to which the entity will be moved
   * @return {[void]}
   */
  setCoords(coords) {
    if (!coords) {
      throw 'The given paramater is invalid to set up the coordinates!';
    }
    this.coords = coords;
  }

  /**
   * Returns the coordinates to which the entity moves
   * @return {object} object literal that contains the coordinates
   */
  getCoords() {
    return this.coords;
  }
}

export default Move;
