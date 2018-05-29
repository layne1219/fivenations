class Activity {
  /**
   * @param {object} entity - Entity instance
   */
  constructor(entity) {
    if (entity) {
      this.entity = entity;
    }
    this.killable = true;
  }

  /**
   * Flags the Activity as active
   */
  activate() {
    this.active = true;
  }

  /**
   * Flags the Activity as inactive
   */
  deactivate() {
    this.active = false;
  }

  /**
   * Remove the Activity from the ActivityManager instance
   */
  kill() {
    if (!this.manager) return;
    this.manager.remove(this);
  }

  /**
   * Sets the manager
   * @param {opbject} manager - ActivityManager instance
   */
  setManager(manager) {
    if (!manager) {
      throw 'The passed Activity Manager object is invalid!';
    }
    this.manager = manager;
  }

  /**
   * Returns if the Activity is activated
   */
  isActivated() {
    return this.active;
  }

  /**
   * Returns whether the Activity can be killed from outside
   */
  isKillable() {
    return this.killable;
  }

  /**
   * Returns the ActivityManager instance
   */
  getManager() {
    return this.manager;
  }
}

export default Activity;
