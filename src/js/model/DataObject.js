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
  const { size } = data;
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
        this.damageHull(params.damage);
      }
    },

    damageHull(value) {
      data.hull = Math.max(data.hull - Math.max(value - data.armor, 1), 0);
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

    getAnimationByKey(key) {
      if (!data.animations) return null;
      return data.animations[key];
    },

    getAnimationOffset() {
      return data.animationOffset || ANIMATION_OFFSET_WHEN_ICONS_ARE_INTEGRATED;
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
  };
}

export default DataObject;
