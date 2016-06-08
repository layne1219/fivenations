define('Entity.ActivityManager', [
    'Entity.Activity',
    'Entity.Activity.Patrol',
    'Entity.Activity.Follow'
], function(Activity, Patrol, Follow) {

    function ActivityManager() {

        var activities = [];

        return {

            add: function(activity) {
                if (!activity instanceof Activity) {
                    throw 'You must extend the manager with an object inherits from Activity!';
                }
                activity.setManager(this);
                activity.activate();
                activities.push(activity);
            },

            remove: function(activity) {
                var found = false;
                for (var i = 0; i < activities.length; i++) {
                    if (activities[i] === activity) {
                        activities[i].deactivate();
                        activities.splice(i, 1);
                        activities[activities.length - 1].activate();
                        break;
                    }
                }
            },

            activateCurrent: function() {
                if (!current) {
                    return;
                }
                current.activate();
            },

            removeAll: function() {
                activities = [];
            },

            update: function() {
                var l = activities.length,
                    currentIdx = l - 1;
                if (0 === l) {
                    return;
                }
                // we are excecuting the last function in the queue treating it with priority
                if (activities[currentIdx].isActivated()) {
                    activities[currentIdx].update();
                }
            },

        };

    }

    ActivityManager.Patrol = Patrol;
    ActivityManager.Follow = Follow;

    return ActivityManager;

});