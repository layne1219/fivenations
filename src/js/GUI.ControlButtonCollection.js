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

define('GUI.ControlButtonCollection', [
	'GUI.StopButtonLogic', 
	'json!abilities'
], function(StopButtonLogic , abilitiesJSON){
	
	var buttonLogics = {};
	
	buttonLogics[abilitiesJSON.stop] = StopButtonLogic;

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