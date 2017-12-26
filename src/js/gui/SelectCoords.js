import Util from '../common/Util';
import Activity from './Activity';
import UserPointer from './UserPointer';

function SelectCoords(...args) {
  Activity.apply(this, args);
  this.init();
}

SelectCoords.prototype = Object.create(Activity.prototype);
SelectCoords.prototype.constructor = SelectCoords;

SelectCoords.prototype.init = () => {
  this.dispatcher = new Util.EventDispatcher();
};

SelectCoords.prototype.activate = () => {
  Activity.prototype.activate.call(this);

  this.callback = (mousePointer) => {
    this.dispatcher.dispatch('select', mousePointer);
    setTimeout(() => {
      this.getActivityManager().cancel();
    }, 10);
  };

  UserPointer.getInstance().on('leftbutton/down/activity', this.callback);
};

SelectCoords.prototype.deactivate = () => {
  Activity.prototype.deactivate.call(this);
  UserPointer.getInstance().remove('leftbutton/down/activity', this.callback);
};

SelectCoords.prototype.on = (event, callback) => {
  this.dispatcher.addEventListener(event, callback);
};

export default SelectCoords;
