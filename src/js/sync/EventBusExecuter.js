import EventBus from './EventBus';
import EventFactory from './EventFactory';
import EventEmitter from './EventEmitter';

let singleton;

function createEventExecuter() {

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

export default {

    getInstance: function() {
        if (!singleton) {
            singleton = createEventExecuter();
        }
        return singleton;
    }

};
