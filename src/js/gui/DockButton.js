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
        EventEmitter.getInstance()
          .synced.entities(':user:selected')
          .getToDock({
            targetEntity,
          });
        targetEntity.selectedAsTarget();
      }

      controlPanel.selectMainPage();
    });

    controlPanel.selectCancelPage();
  },
};
