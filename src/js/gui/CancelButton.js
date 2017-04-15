import ActivityManager from './ActivityManager';

export default {
    activate: function(entityManager, controlPanel) {
        controlPanel.selectMainPage();
        ActivityManager.getInstance().cancel();
    }
};
