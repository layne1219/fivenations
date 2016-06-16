define('GUI.Activity', function() {

    function Activity(activityManager) {
        this.activityManager = activityManager;
    }

    Activity.prototype = {

        activate: function() {
            this.active = true;
        },

        deactivate: function() {
            this.active = false;
        },

        isActive: function() {
            return this.active;
        },

        getActivityManager: function() {
            return this.activityManager;
        }

    };

    return Activity;

});