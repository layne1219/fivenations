import EventEmitter from '../sync/EventEmitter';

export default {
  activate() {
    EventEmitter.getInstance()
      .synced.entities(':user:selected')
      .reset()
      .stop({ resetActivityQueue: true });
  },
};
