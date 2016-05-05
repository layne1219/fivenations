define('GUI.Activity.Point', [
    'GUI.Activity', 
    'UserPointer'
], function(Activity, UserPointer){
   
    function ActivityPoint(){
        var args = [].slice.call(arguments);
        Activity.call(this, args);

        this.init();
    }

    ActivityPoint.prototype = Object.create(Activity.prototype);
    ActivityPoint.prototype.constructor = ActivityPoint;

    ActivityPoint.prototype.init = function(){
        this.setEventListeners();
    };

    ActivityPoint.prototype.setEventListeners = function(){
        this.callback = function(){
            console.log('Activity leftbutton/down');
        }.bind(this);
        UserPointer.getInstance().on('leftbutton/down', this.callback);
    };

    ActivityPoint.prototype.deactivate = function(){
        Activity.prototype.deactivate.call(this);
        UserPointer.getInstance().remove('leftbutton/down', this.callback);
    }

    return ActivityPoint;

});