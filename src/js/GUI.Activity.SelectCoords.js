define('GUI.Activity.SelectCoords', [
    'Util',
    'GUI.Activity', 
    'UserPointer'
], function(Util, Activity, UserPointer){
   
    function ActivitySelectCoords(activityManager){
        var args = [].slice.call(arguments);
        Activity.apply(this, args);

        this.init();
    }

    ActivitySelectCoords.prototype = Object.create(Activity.prototype);
    ActivitySelectCoords.prototype.constructor = ActivitySelectCoords;

    ActivitySelectCoords.prototype.init = function(){
        this.dispatcher = new Util.EventDispatcher();
    };

    ActivitySelectCoords.prototype.activate = function(){
        Activity.prototype.activate.call(this);

        this.callback = function(mousePointer){
            this.dispatcher.dispatch('select', mousePointer);
            this.getActivityManager().cancel();
        }.bind(this);

        UserPointer.getInstance().on('leftbutton/down/activity', this.callback);
    };   

    ActivitySelectCoords.prototype.deactivate = function(){
        Activity.prototype.deactivate.call(this);
        UserPointer.getInstance().remove('leftbutton/down/activity', this.callback);
    };

    ActivitySelectCoords.prototype.on = function(event, callback){
        this.dispatcher.addEventListener(event, callback);
    };

    return ActivitySelectCoords;

});