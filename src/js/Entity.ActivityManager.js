define('Entity.ActivityManager', ['Entity.Anctivity'], function(Activity){

	function ActivityManager(){

		var activities = [];

		return {

			add: function(activity){
				if (!activity instanceof Activity){
					throw 'You must extend the manager with an object inherits from Activity!';
				}
				activity.setManager( this );
				activities.push( activity );
			},

			remove: function(activity){
				for (var i = 0; i < activities.length; i++) {
					if (activities[i] === activity){
						// it might be overkill as splice clears the element suitable for the GC
						delete activities[i];
						activities.splice(i, 1);
						break;
					}
				}
			},

			removeAll: function(){
				activities = [];
			},

			update: function(){
				var l = activities.length,
					currentIdx = l - 1;
				if (0 === l){
					return;
				}
				// we are excecuting the last function in the queue treating it with priority
				if (activities[currentIdx].isActive()){
					activities[currentIdx].update();
				}				
			}

		};

	}

	return ActivityManager;

});