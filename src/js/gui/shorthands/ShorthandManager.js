import Move from './Move';
import Attack from './Attack';
import Follow from './Follow';

let singleton;

const shorthands = [new Attack(), new Dock(), new Follow(), new Move()];

class ShorthandManager {
  /**
   * Executes the various ShortHand logics
   * @param {object} params
   */
  execute(params) {
    this.selectedEntities = params.selectedEntities;
    this.targetEntity = params.targetEntity;
    this.resetActivityQueue = params.resetActivityQueue;

    for (let i = 0; i < shorthands.length; i += 1) {
      const shorthand = shorthands[i];
      if (shorthand.test(this)) {
        shorthand.execute(this);
        return;
      }
    }
  }

  /**
   * Returns the entity that is targeted through the shorthand functjonality
   * @return {object} Entity
   */
  getTargetEntity() {
    return this.targetEntity;
  }

  /**
   * Returns the entity that is targeted through the shorthand functjonality
   * @return {object} Entity
   */
  getSelectedEntities() {
    return this.selectedEntities;
  }

  /**
   * Return true if the activity queue must be reset
   * @return {boolean}
   */
  willActivityQueueReset() {
    return this.resetActivityQueue;
  }
}

export default {
  /**
   * Returns a singleton instance of Shorthand class
   * @return {object} singleton Shorthand instance
   */
  getInstance() {
    if (!singleton) {
      singleton = new ShorthandManager();
    }
    return singleton;
  },
};
