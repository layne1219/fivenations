define('Universal.Event', function(){
	
	function Event(){

	}

	Event.prototype = {

		/**
		 * No-op function to be overwritten in the child objects
		 * @param {array} [targets] [array of instances effected by the event]
		 * @return {void}
		 */
		execute: function(targets){
		}

	};

	return Event;

});