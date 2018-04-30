/* global window */
import Util from '../common/Util';

const ns = window.fivenations;

class Player {
  constructor(config) {
    this.initDispatcher();
    this.setGUID(config);
    this.setName(config);
    this.setTeamInformation(config);
    this.setResources(config);
    this.setAuthority(config.authorised);
  }

  initDispatcher() {
    this.dispatcher = new Util.EventDispatcher();
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
    this.setUranium(config.Uranium || 0);
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
    if (!value) return;
    this.dispatcher.dispatch('change/titanium', {
      old: this.titanium,
      new: value,
    });
    this.titanium = value;
  }

  setSilicium(value) {
    if (!value) return;
    this.dispatcher.dispatch('change/silicium', {
      old: this.silicium,
      new: value,
    });
    this.silicium = value;
  }

  setEnergy(value) {
    if (!value) return;
    this.dispatcher.dispatch('change/energy', {
      old: this.energy,
      new: value,
    });
    this.energy = value;
  }

  setUranium(value) {
    if (!value) return;
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
    const { entityManager } = ns.game;
    return entityManager
      .entities(entity => entity.isEntityControlledByUser(this))
      .reduce((sum, entity) => sum + entity.getDataObject().getSpace(), 0);
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
}

export default Player;
