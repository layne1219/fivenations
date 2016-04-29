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

define('GUI.MoveButtonLogic', function(){

	return {
		activate: function(entityManager, controlPanel){
			controlPanel.selectCancelPage();
		}
	};

});

define('GUI.ControlButtonCollection', [
	'GUI.StopButtonLogic',
	'GUI.MoveButtonLogic',
	'json!abilities'
], function(StopButtonLogic, MoveButtonLogic, abilitiesJSON){
	
	var buttonLogics = {};
	
	buttonLogics[abilitiesJSON.stop] = StopButtonLogic;
	buttonLogics[abilitiesJSON.move] = MoveButtonLogic;

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