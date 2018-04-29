import Activity from '../Activity';
import PlayerManager from '../../../players/PlayerManager';
import EventEmitter from '../../../sync/EventEmitter';
import Util from '../../../common/Util';

const CHECK_INTERVAL = 5000;
const ICARUS_ID = 'icarus';

class CreateIcarus extends Activity {
  /**
   * @param {object} entity - Instance of an Entity class
   */
  constructor(entity) {
    super();
    this.entity = entity;
  }

  /**
   * Executes the activity against an entity
   */
  activate() {
    super.activate();
    this.registerListeners();
    this.kill();
  }

  /**
   * Register listeners against the Mining Station to generate
   * Icarus if it is not available or the previous one was killed.
   * It is only executed for authorised users.
   */
  registerListeners() {
    if (!PlayerManager.getInstance().isUserAuthorised()) return;
    this.checkIcarusInterval = setInterval(
      this.checkIcarus.bind(this),
      CHECK_INTERVAL,
    );
    this.entity.on('remove', () => clearInterval(this.checkIcarusInterval));
  }

  /**
   * Checks at regular interval whether there is an icarus attached
   * to this mining station
   */
  checkIcarus() {
    if (this.entity.hasDeliverer()) return;
    const { x, y } = this.entity.getSprite();
    const team = this.entity.getDataObject().getTeam();
    const emitter = EventEmitter.getInstance();
    emitter.synced.entities.add({
      id: ICARUS_ID,
      team,
      x,
      y,
      noUserControl: true,
      homeStation: this.entity,
    });
  }
}

export default CreateIcarus;
