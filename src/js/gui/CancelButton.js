import ActivityManager from './ActivityManager';
import GUI from './GUI';

export default {
  activate(entityManager, controlPanel) {
    const activityManager = ActivityManager.getInstance();
    const gui = GUI.getInstance();

    controlPanel.selectMainPage();
    activityManager.cancel();
    gui.getBuildingPlacementDisplay().deactivate();
  },
};
