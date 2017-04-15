import EventEmitter from '../sync/EventEmitter';
import SelectCoords from './SelectCoords';
import ActivityManager from './ActivityManager';

export default {
    activate: function(entityManager, controlPanel) {
        var activity = ActivityManager.getInstance().start(SelectCoords);
        activity.on('select', function() {

            var targetEntity;
            entityManager.entities().filter(function(entity) {
                if (entity.isHover()) {
                    targetEntity = entity;
                    return true;
                } else {
                    return false;
                }
            });

            if (targetEntity) {
                EventEmitter
                    .getInstance()
                    .synced
                    .entities(':user:selected')
                    .getToDock({
                        targetEntity: targetEntity
                    });
                targetEntity.selectedAsTarget();
            }

            controlPanel.selectMainPage();
        });

        controlPanel.selectCancelPage();
    }
};
