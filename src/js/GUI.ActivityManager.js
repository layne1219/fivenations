define('GUI.ActivityManager', ['GUI.Activity'], function(Activity) {

    var singleton;

    function createActivityManager() {

        var selectedActivity;

        return {

            start: function(activity) {
                // cancel the current event
                this.cancel();
                this.setActivity(activity);
                return selectedActivity;
            },

            cancel: function() {
                if (this.hasActiveSelection()) {
                    selectedActivity.deactivate();
                    delete selectedActivity;
                    selectedActivity = null;
                }
            },

            setActivity: function(activity) {
                selectedActivity = new activity(this);
                selectedActivity.activate();
                return selectedActivity;
            },

            hasActiveSelection: function() {
                return selectedActivity;
            },

            getSelectedActivity: function() {
                return selectedActivity;
            }

        };

    }

    return {

        getInstance: function() {
            if (!singleton) {
                singleton = createActivityManager();
            }
            return singleton;
        }

    };

});