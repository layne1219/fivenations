define('GUI.Activity.Point', ['GUI.Activity'], function(Activity){
   
    function ActivityPoint(){
        var args = [].slice.call(arguments);
        Activity.call(this, args);

        this.init();
    }

    ActivityPoint.prototype = Object.create(Activity.prototype);
    ActivityPoint.prototype.constructor = ActivityPoint;

    ActivityPoint.prototype.init = function(){
        
    };

    return ActivityPoint;

});