import GetInRange from './GetInRange';
import PlayerManager from '../../../players/PlayerManager';
import EventEmitter from '../../../sync/EventEmitter';
import Util from '../../../common/Util';

class GetToDock extends GetInRange {
  /**
   * Executes the initialisation of the Activity
   */
  activate() {
    // !!! IMPORTANT !!!
    // First param is an indicator that can be used to determine whether
    // the activity is automatically killed if the entity actually occupies
    // the same tile as the target.
    // Here it must be set to "false" as Fighters can occupy the same
    // tile as the target Carriers and they stil must be able to Dock
    super.activate(false);
  }

  /**
   * Updating the activity on every tick
   * @return {[void]}
   */
  update() {
    let distance;

    if (!this.target) {
      return;
    }

    distance = Util.distanceBetween(this.entity, this.target);

    if (distance <= this.range) {
      this.entity.stop();
      this.emitDockEvent();
      this.kill();
      return;
    }

    // checks whether the target has moved since the last check
    if (
      this.coords.x === this.target.getSprite().x &&
      this.coords.y === this.target.getSprite().y
    ) {
    } else {
      this.moveTowardsTarget();
    }
  }

  /**
   * Move towards the target entity
   * @return {void}
   */
  moveTowardsTarget() {
    this.setCoords({
      x: this.target.getSprite().x,
      y: this.target.getSprite().y,
    });
    this.entity.getMotionManager().moveTo(this);
  }

  /**
   * Saving the target entity that will be followed
   * @return {void}
   */
  setTarget(entity) {
    super.setTarget(entity);
    // for optimisation
    this.range = entity.getDataObject().getWidth();
  }

  /**
   * Emits the Universal.Event.Entity.Dock event provided the player is authorised
   * @return {void}
   */

  emitDockEvent() {
    const authorised = PlayerManager.getInstance()
      .getUser()
      .isAuthorised();

    if (!authorised) return;

    EventEmitter.getInstance()
      .synced.entities(this.entity)
      .dock({
        targetEntity: this.target,
        resetActivityQueue: true,
      });
  }
}

export default GetToDock;
