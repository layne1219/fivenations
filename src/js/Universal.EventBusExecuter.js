define('Universal.EventBusExecuter', [
    'Universal.EventBus', 
    'Universal.EventFactory'
], function(EventBus, EventFactory){

    'use strict';
	
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
                            evtObj = factory.getEventObjectById(evt.id);
                            evtObj.execute({
                                targets: evt.targets,
                                data: evt.data
                            });
                            console.log(evtObj);
                        } catch (ex){
                            console.log(ex);
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