define('Entity.ActivityManager', ['Entity.Anctivity'], function(Activity){

	function ActivityManager(){

		var activities = [];

		return {

			add: function(activity){
				if (!activity instanceof Activity){
					throw 'You must extend the manager with an object inherits from Activity!';
				}
				activities.push( activity );
			},

			remove: function(activity){
				for (var i = 0; i < activities.length; i++) {
					if (activities[i] === activity){
						activities.splice(i, 1);
						break;
					}
				}
			},

			removeAll: function(){
				activities = [];
			}

		};

	}

	return ActivityManager;

});