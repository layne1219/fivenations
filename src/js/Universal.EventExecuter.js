define('Universal.EventExecuter', ['Universal.EventBus'], function(EventBus){
	
	var singleton,
		createEventExecuter = function(){

			var eventbus = EventBus.getInstance();

			return {

			};

		};

    return {

        getInstance: function(){
            if (!singleton){
                singleton = createEventExecuter();
            }
            return singleton;
        }

    };


});