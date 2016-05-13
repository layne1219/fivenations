define('Universal.Event.Entity.Move', ['UniversalEvent', 'Universal.EventBus'], function(Event, EventBus){
	
	function UniversalEventEntityMove(){
		var args = [].slice.call(arguments);
		Event.prototype.Event.apply(this, args);
	}

	UniversalEventEntityMove.prototype = Object.create(Event.prototype);
	UniversalEventEntityMove.prototype.constructor = UniversalEventEntityMove;

	/**
	 * Transforming the event into real-time execution
	 * @param {array} [targets] [array of instances effected by the event]
	 * @param {object} [object] [event object]
	 * @return {void}
	 */	
	UniversalEventEntityMove.prototype.execute = function(targets, data){
		if (!targets){
			return;
		}
		targets.forEach(function(entity){
			entity.move(data.x, data.y)
		});
	};

	return new UniversalEventEntityMove();

});