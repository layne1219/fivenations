define('Universal.EventBusExecuter', [
    'Universal.EventBus',
    'Universal.EventFactory',
    'Universal.EventEmitter'
], function(EventBus, EventFactory, EventEmitter) {

    'use strict';

    var singleton,
        createEventExecuter = function() {

            var eventbus = EventBus.getInstance();
            var factory = EventFactory.getInstance();
            var emitter = EventEmitter.getInstance();

            return {

                run: function() {
                    var evt,
                        evtObj;
                    while ((evt = eventbus.next())) {

                        if (!evt.id) {
                            continue;
                        }

                        try {
                            evtObj = factory.getEventObjectById(evt.id);
                            evtObj.execute({
                                targets: evt.targets,
                                data: evt.data,
                                resetActivityQueue: evt.resetActivityQueue
                            });
                            emitter.local.dispatch(evt.id);
                        } catch (ex) {
                            console.debug(ex);
                        }

                    }

                }

            };

        };

    return {

        getInstance: function() {
            if (!singleton) {
                singleton = createEventExecuter();
            }
            return singleton;
        }

    };


});