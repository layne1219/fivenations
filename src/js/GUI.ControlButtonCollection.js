define('GUI.StopButtonLogic', function(){

	return {
		activate: function(controlPanel, entities){
			if (!entities.length){
				return;
			}
			entities.forEach(function(entity){
				entity.stop();
			});
		}
	};

});

define('GUI.ControlButtonCollection', [
	'GUI.StopButtonLogic', 
	'json!abilities'
], function(StopButton , abilitiesJSON){
	
	var buttonLogics = {
			abilitiesJSON.stop: StopButton
		};

	return {

		getLogicByControlButton: function(controlButton){
			if (!controlButton){
				return;
			}
			return this.getLogicById( controlButton.getId() );
		},

		getLogicById: function(id){
			return buttonLogics[id];
		}

	}

});