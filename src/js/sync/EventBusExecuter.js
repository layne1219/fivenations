/* eslint no-cond-assign: 0 */
/* eslint no-continue: 0 */
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
        evtObj = factory.getEventObjectById(evt.id);
        evtObj.execute({
          targets: evt.targets,
          data: evt.data,
          resetActivityQueue: evt.resetActivityQueue,
        });
        // replicate the event against the local dispatcher
        emitter.local.dispatch(evt.id);
        // if there is a callback added we execute it.
        if (evt.callback) {
          evt.callback();
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
