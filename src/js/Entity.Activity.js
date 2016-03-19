define('Entity.Activity', ['Util'], function(Util){

	function Activity(){
	}

	Activity.prototype = {

		active: false,		
		update: function(entity){
		
		},

		activate: function(){
			this.active = true;
		},

		deactivate: function(){
			this.active = false;
		}

	};

	return Activity;

});