import EventEmitter from '../sync/EventEmitter';

export default {
  activate(entityManager, controlPanel, button) {
    const entityId = button.getProducableEntity();
    EventEmitter.getInstance()
      .synced.entities(':user:selected')
      .addProduction({ id: entityId });
  },
};
