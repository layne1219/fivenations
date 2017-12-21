import ActivityManager from './ActivityManager';

export default {
  activate(entityManager, controlPanel) {
    controlPanel.selectMainPage();
    ActivityManager.getInstance().cancel();
  },
};
