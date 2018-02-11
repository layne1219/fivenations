/* global window, Phaser, localStorage */
/* eslint no-underscore-dangle: 0 */
/* eslint class-methods-use-this: 0 */
import Location from './Location';
import EntityManager from '../../entities/EntityManager';

let idCounter = 0;
let locations = [];
let phaserGame;
let singleton;

class LocationManager {
  constructor() {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
  }

  /**
   * Adds an location object to the private collection
   * @param {object} config configuration object
   */
  add(config) {
    const location = new Location({
      id: idCounter,
      manager: this,
      ...config,
    });

    // generic id counter
    idCounter += 1;

    // pushes it to the local location collection
    locations.push(location);
  }

  /**
   * Removes location from the private collection
   * @param {object} location Location instance
   */
  remove(location) {
    if (!location) return;
    for (let i = locations.length - 1; i >= 0; i -= 1) {
      if (location === locations[i]) {
        locations.splice(i, 1);
      }
    }
    location.remove();
    // eslint-disable-next-line no-param-reassign
    location = null;
  }

  /**
   * destroys all the existing locations
   * @return {void}
   */
  reset() {
    locations = [];
  }

  /**
   * Returns a location by the given id
   * @param {number} id
   * @return {object} location instance
   */
  getLocationById(id) {
    for (let i = locations.length - 1; i >= 0; i -= 1) {
      if (locations[i].getId() === id) {
        return locations[i];
      }
    }
    return null;
  }

  /**
   * Returns the list of entities that are situated inside of the
   * given Location
   * @return {array} list of entities
   */
  getEntitiesInLocation(location) {
    const manager = EntityManager.getInstance();
    return manager
      .entities(':not(hibernated)')
      .filter(entity => this.isEntityInLocation(entity, location));
  }

  /**
   * Returns all entities of the given team in the given location
   * @param {object} Location
   * @param {number} team
   * @return {array} list of Entities
   */
  getEntitiesInLocationFromTeam(location, team) {
    return this.getEntitiesInLocation(location).filter(entity => entity.getDataObject().getTeam() === team);
  }

  /**
   * Returns true if the given team has any entity in the given location
   * @param {object} Location
   * @param {number} team
   * @return {boolean}
   */
  hasEntitiesInLocationFromTeam(location, team) {
    return this.getEntitiesInLocation(location).some(entity => entity.getDataObject().getTeam() === team);
  }

  /**
   * Returns true if the given entity is inside the the given Location
   * @param {object} entity - Entity
   * @param {object} location - Location
   * @return {boolean}
   */
  isEntityInLocation(entity, location) {
    const entityX = entity.sprite.x;
    const entityY = entity.sprite.y;

    if (entityX > location.x + location.width) {
      return false;
    }
    if (entityX < location.x) {
      return false;
    }
    if (entityY > location.y + location.height) {
      return false;
    }
    if (entityY < location.y) {
      return false;
    }
    return true;
  }
}

export default {
  /**
   * sets the global Phaser.Game instance
   * @param {void}
   */
  setGame(game) {
    phaserGame = game;
  },

  /**
   * returns singleton instance of the manager object
   * @param {boolean} forceNewInstance
   * @return {object} Singleton instance of LocationManager
   */
  getInstance(forceNewInstance) {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton || forceNewInstance) {
      singleton = new LocationManager();
      singleton.reset();
    }
    return singleton;
  },
};
