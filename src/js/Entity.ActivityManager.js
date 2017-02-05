define('Entity.ActivityManager', [
    'Entity.Activity',
    'Entity.Activity.Move',
    'Entity.Activity.Patrol',
    'Entity.Activity.Follow',
    'Entity.Activity.Stop',
    'Entity.Activity.Idle',
    'Entity.Activity.Fire',
    'Entity.Activity.GetInRange',
    'Entity.Activity.Attack'
], function(Activity, Move, Patrol, Follow, Stop, Idle, Fire, GetInRange, Attack) {

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
                if (!(activity instanceof Idle) && l > 0){
                    if (activities[currentIdx] instanceof Idle){
                        this.removeByIndex(currentIdx);
                    }
                }              
                activities.push(activity);
                activity.setManager(this);
                // @TODO review this dependency 
                // activities.push needs to go first here since the "activate" function might have 
                // dependency on the activity queue
                activity.activate();
            },

            remove: function(activity) {
                for (var i = 0; i < activities.length; i += 1) {
                    if (activities[i] === activity)  {
                        this.removeByIndex(i);
                        break;
                    }
                }
            },

            removeByIndex: function(idx) {
                var lastItem;
                if (!activities[idx]){
                    return;
                }
                activities[idx].deactivate();
                activities.splice(idx, 1);
                if (activities.length > 0) {
                    lastItem = activities[activities.length - 1];
                    lastItem.activate();
                }
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
    ActivityManager.Fire = Fire;
    ActivityManager.GetInRange = GetInRange;
    ActivityManager.Attack = Attack;

    return ActivityManager;

});