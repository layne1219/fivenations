class ControlGroup {
  constructor() {
    this.onRemoveEntityFromGroup = this.removeEntityFromGroup.bind(this);
  }

  /**
   * Sets the entities of the control group
   * @param {object} entities - Array of Entity instances
   */
  set(entities) {
    if (this.entities) {
      this.removeExistingListeners();
    }
    this.addListeners(entities);
    this.entities = entities;
  }

  /**
   * Removes the added listeners to the incorporated entities of the group
   */
  removeExistingListeners() {
    this.entities.forEach((entity) => {
      if (!entity) return;
      entity.off('remove', this.onRemoveEntityFromGroup);
      entity.off('hibernate', this.onRemoveEntityFromGroup);
    });
  }

  /**
   * Adds listeners to the incorporated entities since they must be
   * removed from the group onRemove and onHibernate events
   * @param {object} entities - Array of Entity instances
   */
  addListeners(entities) {
    if (!entities) return;
    entities.forEach((entity) => {
      entity.on('remove', this.onRemoveEntityFromGroup);
      entity.on('hibernate', this.onRemoveEntityFromGroup);
    });
  }

  /**
   * Removes the given entity from the control group
   * @param {object} entity - Entity
   */
  removeEntityFromGroup(entity) {
    const idx = this.entities.indexOf(entity);
    this.entities.splice(idx, 1);
  }

  /**
   * Returns the entities that are added to the control group
   * @return {object} Array of Entity instances
   */
  getEntities() {
    return this.entities;
  }
}

export default ControlGroup;
