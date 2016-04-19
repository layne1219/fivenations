define('GUI.ControlButtonCollection', ['ControlButton'], function(ControlButton){
	
	function TwoStepControlButton(){
		ControlButton.apply(this, [].slice.call(arguments));
	}

	TwoStepControlButton.prototype = Object.create(ControlButton.prototype);
	TwoStepControlButton.prototype.contructor = TwoStepControlButton;

	TwoStepControlButton.prototype.activate = function(ctrlPanel){
		ctrlPanel.selectPage(1);
	};

});