// ------------------------------------------------------------------------------------
// Stop Button Logc
// ------------------------------------------------------------------------------------
define('GUI.StopButtonLogic', function(){
	return {
		activate: function(entityManager, controlPanel){
			var entities = entityManager.getAllSelected();
			if (!entities.length){
				return;
			}
			entities.forEach(function(entity){
				entity.stop();
			});
		}
	};
});

// ------------------------------------------------------------------------------------
// Move Button Logc
// ------------------------------------------------------------------------------------
define('GUI.MoveButtonLogic', [
	'GUI.Activity.SelectCoords', 
	'GUI.ActivityManager'
], function(ActivitySelectCoords, ActivityManager){
	return {
		activate: function(entityManager, controlPanel){
			var activity = ActivityManager.getInstance().start(ActivitySelectCoords);
			activity.on('select', function(){
				controlPanel.selectMainPage();
			});
			controlPanel.selectCancelPage();			
		}
	};
});

// ------------------------------------------------------------------------------------
// Cancel Button Logc
// ------------------------------------------------------------------------------------
define('GUI.CancelButtonLogic', [
	'GUI.ActivityManager'
], function(ActivityManager){
	return {
		activate: function(entityManager, controlPanel){
			controlPanel.selectMainPage();
			ActivityManager.getInstance().cancel();
		}
	};
});

define('GUI.ControlButtonCollection', [
	'GUI.StopButtonLogic',
	'GUI.MoveButtonLogic',
	'GUI.CancelButtonLogic',
	'json!abilities'
], function(StopButtonLogic, MoveButtonLogic, CancelButtonLogic, abilitiesJSON){
	
	var buttonLogics = {};
	
	buttonLogics[abilitiesJSON.stop] = StopButtonLogic;
	buttonLogics[abilitiesJSON.move] = MoveButtonLogic;
	buttonLogics[abilitiesJSON.cancel] = CancelButtonLogic;

	return {

		getLogicByControlButton: function(controlButton){
			if (!controlButton){
				return;
			}
			return this.getLogicById( controlButton.getId() );
		},

		getLogicById: function(id){
			if (!buttonLogics[id]){
				throw 'There is no ButtonLogic registered to the given Id';
			}
			return buttonLogics[id];
		}

	}

});