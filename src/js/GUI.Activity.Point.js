define('GUI.Activity.Point', ['GUI.Activity'], function(Activity){
   
    function ActivityPoint(){
        var args = [].slice.call(arguments);
        Activity.call(this, args);
    }

    ActivityPoint.prototype = Object.create(Activity.prototype);
    ActivityPoint.prototype.constructor = ActivityPoint;

    return ActivityPoint;

});