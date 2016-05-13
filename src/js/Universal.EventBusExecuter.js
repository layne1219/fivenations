define('Universal.EventExecuter', [
    'Universal.EventBus', 
    'Universal.EventFactory'
], function(EventBus, EventFactory){
	
	var singleton,
		createEventExecuter = function(){

			var eventbus = EventBus.getInstance(),
                factory = EventFactory.getInstance();

			return {

                run: function(){
                    var evt,
                        evtObj;
                    while (evt = eventbus.next()){

                        if (!evt.id){
                            continue;
                        }

                        try {
                            evtObj = factory.getEventObjectById();
                            evtObj.execute({
                                targets: evt.targets,
                                data: evt.data
                            });
                        } catch (ex){
                            continue;
                        }

                    }

                }

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