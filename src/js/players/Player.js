/* global window */
import EntityManager from '../entities/EntityManager';
import EventEmitter from '../sync/EventEmitter';

import Util from '../common/Util';

const ns = window.fivenations;

class Player {
  constructor(config) {
    this.initDispatcher();
    this.initEventListeners();
    this.setGUID(config);
    this.setName(config);
    this.setTeamInformation(config);
    this.setResources(config);
    this.setAuthority(config.authorised);
  }

  initDispatcher() {
    this.dispatcher = new Util.EventDispatcher();
  }

  initEventListeners() {
    const emitter = EventEmitter.getInstance().local;
    emitter.addEventListener(
      'entity/number/change',
      this.onEntityNumberChange.bind(this),
    );
  }

  setGUID(config) {
    this.guid = config.guid;
  }

  setName(config) {
    this.name = config.name;
  }

  setTeamInformation(config) {
    this.team = config.team || 1;
    this.user = config.user || false;
    this.independent = config.independent || false;
  }

  setResources(config) {
    this.setTitanium(config.titanium || 0);
    this.setSilicium(config.silicium || 0);
    this.setEnergy(config.energy || 0);
    this.setUranium(config.uranium || 0);
  }

  on(evt, func) {
    if (!evt) return;
    this.dispatcher.addEventListener(evt, func);
  }

  flush() {
    this.setTitanium(this.getTitanium());
    this.setSilicium(this.getTitanium());
    this.setEnergy(this.getTitanium());
    this.setUranium(this.getTitanium());
  }

  setTitanium(value) {
    if (value === undefined) return;
    this.dispatcher.dispatch('change/titanium', {
      old: this.titanium,
      new: value,
    });
    this.titanium = value;
  }

  setSilicium(value) {
    if (value === undefined) return;
    this.dispatcher.dispatch('change/silicium', {
      old: this.silicium,
      new: value,
    });
    this.silicium = value;
  }

  setEnergy(value) {
    if (value === undefined) return;
    this.dispatcher.dispatch('change/energy', {
      old: this.energy,
      new: value,
    });
    this.energy = value;
  }

  setUranium(value) {
    if (value === undefined) return;
    this.dispatcher.dispatch('change/uranium', {
      old: this.uranium,
      new: value,
    });
    this.uranium = value;
  }

  setAuthority(authority) {
    this.authorised = !!authority;
  }

  getTitanium() {
    return this.titanium;
  }

  getSilicium() {
    return this.silicium;
  }

  getEnergy() {
    return this.energy;
  }

  getUranium() {
    return this.uranium;
  }

  getTeam() {
    return this.team;
  }

  getCurrentEntityNumber() {
    return this.currentEntityCount;
  }

  getSupply() {
    return this.supply;
  }

  /**
   * Returns the aggregated number of Energy Storage
   * @return {number}
   */
  getMaxEnergyStorage() {
    return this.maxEnergyStorage;
  }

  /**
   * Executed when the number of entities changes
   */
  onEntityNumberChange() {
    const { entityManager } = ns.game;

    // recalculates storage number
    this.maxEnergyStorage = entityManager
      .entities(`:player(${this.team})`)
      .reduce(
        (sum, entity) => sum + entity.getDataObject().getEnergyStorage(),
        0,
      );

    // recalculates the current entity number
    this.currentEntityCount = entityManager
      .entities(`:player(${this.team})`)
      .reduce((sum, entity) => sum + entity.getDataObject().getSpace(), 0);

    // recalculates the current supply
    this.supply = entityManager
      .entities(`:player(${this.team})`)
      .reduce((sum, entity) => sum + entity.getDataObject().getSupply(), 0);

    // AUTHORITIVE ACTIONS
    if (this.authorised) {
      // updates resources if energy is maxed out
      if (this.energy > this.maxEnergyStorage) {
        const emitter = EventEmitter.getInstance().synced.players(this);
        emitter.alter({
          energy: this.maxEnergyStorage,
          overwrite: true,
        });
      }
    }
  }

  getGUID() {
    return this.guid;
  }

  isControlledByUser() {
    return this.user;
  }

  isAuthorised() {
    return this.authorised;
  }

  isIndependent() {
    return this.independent;
  }

  /**
   * Returns whether all the required entities have been produced
   * prior to the production of the given entity
   * @param {object} entityId - string
   * @return {boolean}
   */
  hasAllRequiredEntitiesFor(entityId) {
    const { game } = ns.game;
    const { requiredEntities } = game.cache.getJSON(entityId);
    const entityManager = EntityManager.getInstance();

    if (!requiredEntities || !requiredEntities.length) {
      return true;
    }

    const entities = entityManager.entities(`:player(${this.team})`);
    const found = {};

    // collects all the different kind of entities
    entities.forEach((entity) => {
      const DO = entity.getDataObject();
      const id = DO.getId();
      found[id] = true;
    });

    // if the player has all the required entities it returns true
    return requiredEntities.every(id => found[id]);
  }
}

export default Player;
