import Util from '../common/Util';
import Activity from './Activity';
import UserPointer from './UserPointer';

function SelectCoords() {
    var args = [].slice.call(arguments);
    Activity.apply(this, args);

    this.init();
}

SelectCoords.prototype = Object.create(Activity.prototype);
SelectCoords.prototype.constructor = SelectCoords;

SelectCoords.prototype.init = function() {
    this.dispatcher = new Util.EventDispatcher();
};

SelectCoords.prototype.activate = function() {
    Activity.prototype.activate.call(this);

    this.callback = function(mousePointer) {
        this.dispatcher.dispatch('select', mousePointer);
        setTimeout(function() {
            this.getActivityManager().cancel();
        }.bind(this), 10);
    }.bind(this);

    UserPointer.getInstance().on('leftbutton/down/activity', this.callback);
};

SelectCoords.prototype.deactivate = function() {
    Activity.prototype.deactivate.call(this);
    UserPointer.getInstance().remove('leftbutton/down/activity', this.callback);
};

SelectCoords.prototype.on = function(event, callback) {
    this.dispatcher.addEventListener(event, callback);
};

export default SelectCoords;
