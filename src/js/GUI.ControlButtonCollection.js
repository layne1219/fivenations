define('GUI.ControlButtonCollection', ['ControlButton'], function(ControlButton){
	
	function TwoStepControlButton(){
		ControlButton.apply(this, [].slice.call(arguments));
	}

	TwoStepControlButton.prototype = Object.create(ControlButton.prototype);
	TwoStepControlButton.prototype.contructor = TwoStepControlButton;

	TwoStepControlButton.prototype.activate = function(ctrlPanel){
		ctrlPanel.selectPage(2);
	};

	function ThreeStepControlButton(){
		ControlButton.apply(this, [].slice.call(arguments));
	}

	ThreeStepControlButton.prototype = Object.create(ControlButton.prototype);
	ThreeStepControlButton.prototype.contructor = ThreeStepControlButton;

	ThreeStepControlButton.prototype.activate = function(ctrlPanel){
		ctrlPanel.selectPage(1);
	};

});