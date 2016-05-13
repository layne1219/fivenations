define('Universal.Event.Entity.Move', ['UniversalEvent', 'Universal.EventBus'], function(Event, EventBus){
	
	function UniversalEventEntityMove(){
		var args = [].slice.call(arguments);
		Event.prototype.Event.apply(this, args);
	}

	UniversalEventEntityMove.prototype = Object.create(Event.prototype);
	UniversalEventEntityMove.prototype.constructor = UniversalEventEntityMove;

		/**
		 * No-op function to be overwritten in the child objects
		 * @param {object} [options] [extendable object that presents event details]
		 * @return {void}
		 */
	UniversalEventEntityMove.prototype.execute = function(options){
		if (!options.targets){
			return;
		}
		options.targets.forEach(function(entity){
			entity.move(options.data.x, options.data.y);
		});
	};

	return UniversalEventEntityMove;

});