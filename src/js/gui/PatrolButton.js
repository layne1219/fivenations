import EventEmitter from '../sync/EventEmitter';
import SelectCoords from './SelectCoords';
import ActivityManager from './ActivityManager';

const ns = window.fivenations;

export default {
  activate(entityManager, controlPanel) {
    const activity = ActivityManager.getInstance().start(SelectCoords);
    activity.on('select', (mousePointer) => {
      const coords = mousePointer.getRealCoords();

      EventEmitter.getInstance()
        .synced.entities(':user:selected')
        .patrol({
          x: coords.x,
          y: coords.y,
        });

      ns.game.GUI.putClickAnim(coords.x, coords.y);
      controlPanel.selectMainPage();
    });
    // @TODO this should be unified as most of the buttons share this logic
    controlPanel.selectCancelPage();
  },
};
