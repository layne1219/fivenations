let singleton;

function createEventBus() {
  const queue = [];

  return {
    next() {
      return queue.shift();
    },

    add(evt) {
      let ids = [];
      if (!evt || !evt.id) {
        return;
      }
      if (evt.targets && evt.targets.length) {
        evt.targets = evt.targets.map(entity => entity.getGUID());
      }
      ids = [].concat(evt.id);
      if (ids.length > 1) {
        ids.forEach((id) => {
          const event = Object.create(evt);
          event.id = id;
          queue.push(event);
        });
      } else {
        queue.push(evt);
      }
    },

    remove() {
      for (let i = queue.length - 1; i >= 0; i -= 1) {
        if (queue[i].uid === event.uid) {
          queue.slice(i, 1);
          return;
        }
      }
    },

    reset() {
      queue.splice(0, queue, length);
    },
  };
}

export default {
  getInstance() {
    if (!singleton) {
      singleton = createEventBus();
    }
    return singleton;
  },
};
