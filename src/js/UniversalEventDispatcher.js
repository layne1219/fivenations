define('UniversalEventDispatcher', ['Util'], function(Util){
	var singleton;

	return {
		getInstance: function(){
			if (!singleton){
				singleton = new Util.EventDispatcher();
			}
			return singleton;
		}
	}

});