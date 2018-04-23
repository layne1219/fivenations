import EventEmitter from '../sync/EventEmitter';
import SelectCoords from './SelectCoords';
import ActivityManager from './ActivityManager';

export default {
  activate(entityManager, controlPanel) {
    const activity = ActivityManager.getInstance().start(SelectCoords);
    activity.on('select', () => {
      let targetEntity;
      entityManager.entities().filter((entity) => {
        if (entity.isHover()) {
          targetEntity = entity;
          return true;
        }
        return false;
      });

      if (targetEntity) {
        const resetActivityQueue = true;
        EventEmitter.getInstance()
          .synced.entities(':user:selected')
          .mine({
            targetEntity,
            resetActivityQueue,
          });
        targetEntity.selectedAsTarget();
      }

      controlPanel.selectMainPage();
    });

    controlPanel.selectCancelPage();
  },
};
