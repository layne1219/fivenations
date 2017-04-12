import EventEmitter from '../sync/EventEmitter';
import SelectCoords from './SelectCoords';
import ActivityManager from './ActivityManager';

const ns = window.fivenations;
export default {
    activate: function(entityManager, controlPanel) {
        var activity = ActivityManager.getInstance().start(SelectCoords);
        activity.on('select', function(mousePointer) {

            var coords = mousePointer.getRealCoords();

            EventEmitter
                .getInstance()
                .synced
                .entities(':user:selected')
                .move({
                    x: coords.x,
                    y: coords.y
                });

            ns.game.GUI.putClickAnim(coords.x, coords.y);
            controlPanel.selectMainPage();
        });
        controlPanel.selectCancelPage();
    }
};
