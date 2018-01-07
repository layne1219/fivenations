let singleton;

function createActivityManager() {
  let selectedActivity;

  return {
    start(activity) {
      // cancel the current event
      this.cancel();
      this.setActivity(activity);
      return selectedActivity;
    },

    cancel() {
      if (this.hasActiveSelection()) {
        selectedActivity.deactivate();
        selectedActivity = null;
      }
    },

    setActivity(ActivityClass) {
      selectedActivity = new ActivityClass(this);
      selectedActivity.activate();
      return selectedActivity;
    },

    hasActiveSelection() {
      return selectedActivity;
    },

    getSelectedActivity() {
      return selectedActivity;
    },
  };
}

export default {
  getInstance() {
    if (!singleton) {
      singleton = createActivityManager();
    }
    return singleton;
  },
};
