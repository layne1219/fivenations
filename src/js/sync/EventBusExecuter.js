import EventBus from './EventBus';
import EventFactory from './EventFactory';
import EventEmitter from './EventEmitter';

let singleton;

function createEventExecuter() {
  const eventbus = EventBus.getInstance();
  const factory = EventFactory.getInstance();
  const emitter = EventEmitter.getInstance();

  return {
    run() {
      let evt;
      let evtObj;

      while ((evt = eventbus.next())) {
        if (!evt.id) {
          continue;
        }
        try {
          evtObj = factory.getEventObjectById(evt.id);
          evtObj.execute({
            targets: evt.targets,
            data: evt.data,
            resetActivityQueue: evt.resetActivityQueue,
          });
          emitter.local.dispatch(evt.id);
        } catch (ex) {
          console.debug(ex);
        }
      }
    },

    reset() {
      eventbus.reset();
    },
  };
}

export default {
  getInstance() {
    if (!singleton) {
      singleton = createEventExecuter();
    }
    return singleton;
  },
};
