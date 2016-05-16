define('Universal.Event', function(){
	
	'use strict';

	function Event(){

	}

	Event.prototype = {

		/**
		 * No-op function to be overwritten in the child objects
		 * @param {object} [options] [extendable object that presents event details]
		 * @return {void}
		 */
		execute: function(options){
		}

	};

	return Event;

});