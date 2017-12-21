function Event() {}

Event.prototype = {
  /**
   * No-op function to be overwritten in the child objects
   * @param {object} [options] [extendable object that presents event details]
   * @return {void}
   */
  execute() {},
};

export default Event;
