define('GUI.ActivityManager', ['GUI.Activity'], function(Activity){
   
	var singleton;

	function createActivityManager(){

		var selectedActivity;

		return {

			createActivity: function(){
				if (this.hasActiveSelection()){
					selectedActivity.deactivate();
				}
				selectedActivity = new Activity();
				selectedActivity.activate();
			},

			hasActiveSelection: function(){
				return selectedActivity !== null;
			},

			getSelectedActivity: function(){
				return selectedActivity;
			}

		};

	}

	return {

		getInstance: function(){		
			if (!singleton){
				singleton = createActivityManager();
			}
			return singleton;
		}

	};   

});