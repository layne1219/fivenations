function Activity() {}

Activity.prototype = {
  active: false,
  initialised: false,
  manager: null,

  update() {},

  activate() {
    this.active = true;
  },

  deactivate() {
    this.active = false;
  },

  kill() {
    if (!this.manager) return;
    this.manager.remove(this);
  },

  setManager(manager) {
    if (!manager) {
      throw 'The passed Activity Manager object is invalid!';
    }
    this.manager = manager;
  },

  isActivated() {
    return this.active;
  },

  getManager() {
    return this.manager;
  },
};

export default Activity;
