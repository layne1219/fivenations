import EventEmitter from '../sync/EventEmitter';

export default {
  activate() {
    EventEmitter.getInstance()
      .synced.entities(':user:selected')
      .cancelProduction(0);
  },
};
