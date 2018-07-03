import Util from '../common/Util';
import Activity from './Activity';
import UserPointer from './UserPointer';
import UserKeyboard from './UserKeyboard';

class SelectCoords extends Activity {
  constructor(...args) {
    super(...args);
    this.init();
  }

  /**
   * Initialises local helpers
   */
  init() {
    this.dispatcher = new Util.EventDispatcher();
    this.prepareCallbacks();
  }

  /**
   * Sets the callbacks against user events
   */
  prepareCallbacks() {
    this.onSelect = (mousePointer) => {
      this.dispatcher.dispatch('select', mousePointer);
      this.getActivityManager().cancel();
    };

    this.onCancel = () => {
      this.dispatcher.dispatch('cancel');
      this.getActivityManager().cancel();
    };
  }

  /**
   * Activates the Activity
   */
  activate() {
    super.activate();
    UserPointer.getInstance().on('leftbutton/down/activity', this.onSelect);
    UserPointer.getInstance().on('rightbutton/down/activity', this.onCancel);
    UserKeyboard.getInstance().on('key/esc', this.onCancel);
  }

  /**
   * Removes event listeners and tear down helpers
   */
  deactivate() {
    super.deactivate();
    UserPointer.getInstance().remove('leftbutton/down/activity', this.onSelect);
    UserPointer.getInstance().remove(
      'rightbutton/down/activity',
      this.onCancel,
    );
    UserKeyboard.getInstance().remove('key/esc', this.onCancel);
  }

  /**
   * Registers listeners against the given event
   * @param {string} event - event id
   * @param {function} callback
   */
  on(event, callback) {
    this.dispatcher.addEventListener(event, callback);
  }
}

export default SelectCoords;
