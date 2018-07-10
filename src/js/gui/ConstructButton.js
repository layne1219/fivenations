/* global window */
import EventEmitter from '../sync/EventEmitter';
import PlayerManager from '../players/PlayerManager';
import SelectCoords from './SelectCoords';
import ActivityManager from './ActivityManager';
import GUI from './GUI';

const ns = window.fivenations;

/**
 * Returns an object holding all the required resources to produce
 * the given entity
 * @param {stirng} entityId - Id of the entity to be produced
 * @return {object} collection of the required resources
 */
function getRequiredResources(entityId) {
  const data = ns.game.game.cache.getJSON(entityId);
  return {
    titanium: data.titanium,
    silicium: data.silicium,
    uranium: data.uranium,
    energy: data.energy,
    space: data.space,
  };
}

/**
 * Returns the available resources of the current user
 * @return {object} collection of the available resources
 */
function getAvailableResources() {
  const user = PlayerManager.getInstance().getUser();
  return {
    titanium: user.getTitanium(),
    silicium: user.getSilicium(),
    energy: user.getEnergy(),
    space: user.getSupply(),
  };
}

/**
 * Checks if the user has the sufficient amount of resources to
 * get the production of the given entity kicked off
 * @param {stirng} entityId - Id of the entity to be produced
 * @return {boolean}
 */
function hasUserSufficientResources(entityId) {
  const emitter = EventEmitter.getInstance();
  const needed = getRequiredResources(entityId);
  const available = getAvailableResources();
  const keys = Object.keys(needed);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (needed[key] > available[key]) {
      emitter.local.dispatch(`resources/unsufficient/${key}`);
      return false;
    }
  }
  return true;
}

/**
 * Checks whether the construction site is blocked or not
 * @param {object} BPD - BuildingPlacementDisplay instance
 * @return {boolean}
 */
function canConstructThere(BPD) {
  if (!BPD.canConstructThere()) {
    const emitter = EventEmitter.getInstance();
    emitter.local.dispatch('building/placement/occupied');
    return false;
  }
  return true;
}

export default {
  activate(entityManager, controlPanel, button) {
    const entityId = button.getProducableEntity();
    const activityManager = ActivityManager.getInstance();
    const gui = GUI.getInstance();

    if (hasUserSufficientResources(entityId)) {
      const BPD = gui.getBuildingPlacementDisplay();
      const activity = activityManager.start(SelectCoords);

      activity.on('select', () => {
        if (!canConstructThere(BPD)) {
          activity.doNotCancel();
          return;
        }

        const data = {
          placementCoords: BPD.getPlacementCoords(),
          placementTileCoords: BPD.getPlacementTileCoords(),
          entityId,
        };

        EventEmitter.getInstance()
          .synced.entities(':user:selected')
          .createConstructionSite(data);

        activity.doCancel();
        controlPanel.selectMainPage();
        BPD.deactivate();
      });

      activity.on('cancel', () => {
        controlPanel.selectMainPage();
        BPD.deactivate();
      });

      controlPanel.selectCancelPage();
      BPD.activate(entityId);
    }
  },
};