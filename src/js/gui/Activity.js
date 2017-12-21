function Activity(activityManager) {
  this.activityManager = activityManager;
}

Activity.prototype = {
  activate() {
    this.active = true;
  },

  deactivate() {
    this.active = false;
  },

  isActive() {
    return this.active;
  },

  getActivityManager() {
    return this.activityManager;
  },
};

export default Activity;
