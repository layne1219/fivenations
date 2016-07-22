define('Entity.ActivityManager', [
    'Entity.Activity',
    'Entity.Activity.Move',
    'Entity.Activity.Patrol',
    'Entity.Activity.Follow',
    'Entity.Activity.Stop',
    'Entity.Activity.Idle'
], function(Activity, Move, Patrol, Follow, Stop, Idle) {

    function ActivityManager(entity) {

        var activities = [];

        return {

            /**
             * Adds the given activity to the activity queue
             * @param {object} Activity [An instance that inherits from Activity]
             */
            add: function(activity) {
                var l = activities.length,
                    currentIdx = l - 1;
                if (!activity instanceof Activity) {
                    throw 'You must extend the manager with an object inherits from Activity!';
                }
                // removes the current activiy if it's Idle
                if (!activity instanceof Idle && l > 0){
                    if (activities[currentIdx] instanceof Idle){
                        this.removeByIndex(currentIdx);
                    }
                }
                activity.setManager(this);
                activity.activate();
                activities.push(activity);
            },

            remove: function(activity) {
                for (var i = 0; i < activities.length; i += 1) {
                    if (activities[i] === activity) {
                        this.removeByIndex(i);
                        break;
                    }
                }
            },

            removeByIndex: function(idx) {
                if (!activities[idx]){
                    return;
                }
                activities[idx].deactivate();
                activities.splice(idx, 1);
                activities[activities.length - 1].activate();
            },

            removeAll: function() {
                activities = [];
            },

            update: function() {
                var l = activities.length,
                    currentIdx = l - 1;
                if (0 === l) {
                    // when the activity list is emtpty the entity should go idling
                    this.add(new Idle(entity));
                    return;
                }
                // we are excecuting the last function in the queue treating it with priority
                if (activities[currentIdx].isActivated()) {
                    activities[currentIdx].update();
                }
            },

        };

    }

    ActivityManager.Move = Move;
    ActivityManager.Stop = Stop;
    ActivityManager.Patrol = Patrol;
    ActivityManager.Follow = Follow;

    return ActivityManager;

});