class Location {
  /**
   * initialises a Location instance
   * @param {object} config Configuration object to initialise the effect object
   * @return {object}
   */
  constructor(config) {
    this.setId(config);
    this.setCoordinates(config);
    this.setManager(config);
  }

  /**
   * Sets the unique id
   * @param {object} config
   */
  setId(config) {
    this.id = config.id;
  }

  /**
   * Sets the dimension of the Location
   * @param {object} config
   */
  setCoordinates(config) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
  }

  /**
   * Registers the EffectManager instance
   * @param {config} config Configuration object that contains the reference to the manager instance
   */
  setManager(config) {
    this.manager = config.manager;
  }

  /**
   * Removes location from LocationManager's list
   */
  remove() {
    this.manager.remove(this);
  }

  /**
   * Returns the Id of the location
   * @return {number}
   */
  getId() {
    return this.id;
  }

  /**
   * Return the LocationManager instance that incorporates this very Location
   * @param {object} LocationManager
   */
  getManager() {
    return this.manager;
  }
}

export default Location;
