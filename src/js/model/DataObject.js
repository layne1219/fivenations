/* eslint no-underscore-dangle: 0 */
import {
  ENTITY_SIZES,
  ANIMATION_OFFSET_WHEN_ICONS_ARE_INTEGRATED,
} from '../common/Const';

import FogOfWarMasks from '../map/FogOfWarMasks';

/**
 * Returns the dimensions of the given entity model
 * @param {object} data - attributes of given entity model
 */
function getDimensionsBySize(data) {
  const { size, customSize } = data;
  if (customSize && customSize.width && customSize.height) return customSize;
  if (!size || !ENTITY_SIZES[size]) return ENTITY_SIZES.m;
  return ENTITY_SIZES[size];
}

/**
 * Returns the damage area of the given entity model
 * @param {object} data - attributes of given entity model
 */
function getDamageArea(data) {
  const damageArea = data.sizeOffset;
  if (!damageArea) {
    return getDimensionsBySize(data);
  }
  return {
    width: damageArea.w * 2,
    height: damageArea.h * 2,
  };
}

function DataObject(json) {
  const data = Object.assign({}, json);

  // setting up custom gameplay related data attributes
  data.maxhull = data.hull;
  data.maxshield = data.shield;
  data.maxpower = data.power;
  data.maxhangar = data.hangar;
  data.team = 1;

  // entity dimensions
  data.dimensions = getDimensionsBySize(data);
  data.damageArea = getDamageArea(data);

  // cargo
  if (data.cargoCapacity > 0) {
    data.cargoTitanium = 0;
    data.cargoSilicium = 0;
    data.cargoUranium = 0;
  }

  // for providing privacy for the data variables we have to create a closure here so as not to
  // publish any data variable held by the entity
  return {
    damage(params) {
      const shield = this.getShield();
      if (shield > 0) {
        const diff = shield - params.damageShield;
        if (diff < 0) {
          this.damageShield(params.damageShield);
          this.damageHull(-diff);
        } else {
          this.damageShield(params.damageShield);
        }
      } else {
        this.damageHull(params.damage, params.ignoreArmor);
      }
    },

    /**
     * Deducts the given amount from the entity's Hull value.
     * If the ignoreArmor is truthy the logic will disregard the
     * current armor.
     * @param {number} value - the amount by which the hull will be reduced
     * @param {boolean} ignoreArmor - ignorse the armor
     */
    damageHull(value, ignoreArmor = false) {
      const armor = ignoreArmor ? 0 : data.armor;
      data.hull = Math.max(data.hull - Math.max(value - armor, 1), 0);
    },

    damageShield(value) {
      data.shield = Math.max(data.shield - value, 0);
    },

    restoreShield(value) {
      data.shield = Math.min(data.maxshield, data.shield + value);
    },

    setTeam(team) {
      data.team = team;
    },

    setCargoTitanium(amount) {
      data.cargoTitanium = amount;
    },

    setCargoSilicium(amount) {
      data.cargoSilicium = amount;
    },

    setCargoUranium(amount) {
      data.cargoUranium = amount;
    },

    isBuilding() {
      return !!data.building;
    },

    getTeam() {
      return data.team;
    },

    getId() {
      return data.id;
    },

    getName() {
      return data.name;
    },

    getType() {
      return data.type;
    },

    getMaxHull() {
      return data.maxhull;
    },

    getMaxShield() {
      return data.maxshield;
    },

    getMaxPower() {
      return data.maxpower;
    },

    getMaxHangar() {
      return data.maxhangar;
    },

    getHull() {
      return data.hull;
    },

    getShield() {
      return data.shield;
    },

    getPower() {
      return data.power;
    },

    getArmor() {
      return data.armor;
    },

    getHangar() {
      return data.hangar;
    },

    getSpeed() {
      return data.speed;
    },

    getManeuverability() {
      return data.maneuverability;
    },

    getVision() {
      return data.vision;
    },

    getVisionRange() {
      // use object context to cache calculated vision range value
      if (!this.visionRange) {
        this.visionRange = FogOfWarMasks.getVisionScreenWidth(this.getVision());
      }
      return this.visionRange;
    },

    getWeapons() {
      return data.weapons;
    },

    getTitanium() {
      return data.titanium;
    },

    getSilicium() {
      return data.silicium;
    },

    getEnergy() {
      return data.energy;
    },

    getUranium() {
      return data.uranium;
    },

    getSpace() {
      return data.space;
    },

    getSupply() {
      return data.supply || 0;
    },

    getEnergyStorage() {
      return data.energyStorage || 0;
    },

    getEnergyEmission() {
      return data.energyEmission;
    },

    getEnergyEmissionRate() {
      return data.energyEmissionRate;
    },

    getBuildingTime() {
      return data.buildingTime;
    },

    getDirections() {
      return data.directions;
    },

    getAngleOffset() {
      return data.angleOffset;
    },

    getAnimFrame() {
      return data.animFrame;
    },

    getAnimType() {
      return data.animType;
    },

    getWidth() {
      return data.dimensions.width;
    },

    getHeight() {
      return data.dimensions.height;
    },

    getDamageWidth() {
      return data.damageArea.width;
    },

    getDamageHeight() {
      return data.damageArea.height;
    },

    getVariances() {
      return data.variances || [];
    },

    getCustomFrame() {
      return data.customFrame;
    },

    getAnimations() {
      return data.animations;
    },

    getJetEngineSprite() {
      return data.jetEngineSprite;
    },

    getJetEngineFrames() {
      return data.jetEngineFrames;
    },

    getJetEngineAlphaOffset() {
      return data.jetEngineAlphaOffset;
    },

    getAnimationByKey(key) {
      if (!data.animations) return null;
      return data.animations[key];
    },

    getAnimationOffset() {
      if (data.animationOffset === undefined) {
        return ANIMATION_OFFSET_WHEN_ICONS_ARE_INTEGRATED;
      }
      return data.animationOffset;
    },

    hasAnimation(key) {
      return !!data.animations[key];
    },

    hasMultipleAnimationFor(key) {
      if (!this.hasAnimation(key)) return false;
      const animation = this.getAnimationByKey(key);
      // whether the animation definition is an array
      return animation.length;
    },

    hasJetEngine() {
      return data.hasJetEngine;
    },

    hasRealManeuverSystem() {
      return data.realManeuverSystem || false;
    },

    getEvents() {
      return data.events;
    },

    getEvent(evt) {
      if (!evt || !data.events) return null;
      return data.events[evt];
    },

    getTTL() {
      return data.ttl;
    },

    shouldBeRemovedIfOutOfRange() {
      return data.removeIfOutOfRange;
    },

    getFollowTarget() {
      return data.followTarget;
    },

    getTrails() {
      return data.trails;
    },

    isFighter() {
      if (!this._isFighter) {
        this._isFighter = this.getType() === 'Fighter';
      }
      return this._isFighter;
    },

    isWorker() {
      if (!this._isWorker) {
        this._isWorker = this.getType() === 'Worker';
      }
      return this._isWorker;
    },

    isDestroyer() {
      if (!this._isDestroyer) {
        this._isDestroyer = this.getType() === 'Destroyer';
      }
      return this._isDestroyer;
    },

    isSpaceObject() {
      if (!this._isSpaceObject) {
        this._isSpaceObject = this.getType() === 'Space Object';
      }
      return this._isSpaceObject;
    },

    isResource() {
      return data.resource;
    },

    isNotClickable() {
      return data.notClickable;
    },

    getTargetGraphicsGroup() {
      return data.targetGraphicsGroup;
    },

    toJSON() {
      const blackList = [
        'maxhangar',
        'maxpower',
        'maxshield',
        'maxhull',
        'dimensions',
        'team',
      ];
      return JSON.stringify(
        data,
        (key, value) => {
          if (blackList.indexOf(key) !== -1) return undefined;
          return value;
        },
        '  ',
      );
    },

    getProjectileOffset() {
      return data.initialPoints || {};
    },

    getSelectionOffset() {
      return data.selectionOffset || {};
    },

    doesPersistOrienationFromEmitter() {
      return data.persistOrienationFromEmitter;
    },

    getFrames() {
      return data.frames;
    },

    getCargoCapacity() {
      return data.cargoCapacity;
    },

    getCargoTitanium() {
      return data.cargoTitanium;
    },

    getCargoSilicium() {
      return data.cargoSilicium;
    },

    getCargoUranium() {
      return data.cargoUranium;
    },

    /**
     * Returns whether the entity's cargo is full up
     * @return {boolean}
     */
    isCargoFull() {
      const sum = this.getCargoSum();
      return sum >= data.cargoCapacity;
    },

    /**
     * Returns the cargo attributes of the given entity
     * @param {object} entity - Entity instance
     * @return {object} - { titanium, silicium, uranium }
     */
    getCargo() {
      return {
        titanium: this.getCargoTitanium(),
        silicium: this.getCargoSilicium(),
        uranium: this.getCargoUranium(),
      };
    },

    /**
     * Returns the mrged amount of cargo
     * @return {number} summarised amount of cargo
     */
    getCargoSum() {
      const cargo = this.getCargo();
      return Object.keys(cargo).reduce((sum, key) => cargo[key] + sum, 0);
    },

    /**
     * Returns an array of strings representing entities that can
     * be produced
     * @return {object} list of producable entities
     */
    getProduction() {
      return data.production;
    },

    /**
     * Returns an array of strings representing entities that can
     * be constructed
     * @return {object} list of producable entities
     */
    getConstruction() {
      return data.construction;
    },

    /**
     * Returns an array of strings representing entities that
     * must be in existance prior to the production of this entity
     * @return {object} array of entity IDs
     */
    getRequiredEntities() {
      return data.requireEntities;
    },

    /**
     * Returns an array of strings representing resources that
     * must be finished prior to the production of this entity
     * @return {object} array of research IDs
     */
    getRequiredResources() {
      return data.requiredResources;
    },

    /**
     * Returns the custom colour with which the entity is displayed
     * on the Minimap
     * @return {string}
     * @example '0x123456'
     */
    getCustomMinimapColor() {
      return data.customMinimapColor;
    },
  };
}

export { getDimensionsBySize };
export default DataObject;
