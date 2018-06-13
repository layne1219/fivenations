/* eslint no-underscore-dangle: 0 */
import Weapon from './Weapon';
import Util from '../../common/Util';
import { WEAPON_INSTANCE_DELAY } from '../../common/Const';

const weaponsJSON = require('../../../assets/datas/common/weapons.json');

const cache = {};

/**
 * Returns a weapon object by the given Id
 * @param  {integer} id
 * @return {object} object with attributes of the weapon
 */
function createWeaponById(id) {
  let dataSource;
  if (!cache[id]) {
    for (let i = weaponsJSON.length - 1; i >= 0; i -= 1) {
      if (weaponsJSON[i].id !== id) continue;
      cache[id] = weaponsJSON[i];
    }
  }
  if (window.editor && localStorage && localStorage.getItem(id)) {
    dataSource = JSON.parse(localStorage.getItem(id));
  } else {
    dataSource = cache[id];
  }
  return new Weapon(dataSource);
}

/**
 * Constructor function to initialise the WeaponManager
 * @param {[object]} entity [The target entity whose attributes will be tested]
 */
function WeaponManager(entity) {
  this.init(entity);
  this.initWeapons();
}

WeaponManager.prototype = {
  /**
   * Initialising the helper variables of the manager instance
   * @param  {[object]} entity [Entity instance]
   * @return {[void]}
   */
  init(entity) {
    this.entity = entity;
  },

  /**
   * Initialises the weapon objects according to the DataObject instance
   * attached to the given entity
   * @return {void}
   */
  initWeapons() {
    const ids = {};
    this.weapons = [];

    this.entity
      .getDataObject()
      .getWeapons()
      .forEach((id) => {
        if (!id) return;

        const weapon = createWeaponById(id);

        if (!ids[id]) ids[id] = [];
        ids[id].push(weapon);

        if (ids[id].length > 1) {
          const instanceDelay =
            weapon.getInstanceDelay() || WEAPON_INSTANCE_DELAY;
          const calculatedInstanceDelay = (ids[id].length - 1) * instanceDelay;
          // shift release time with instance delay
          weapon.setInstanceDelay(calculatedInstanceDelay);
          // shift cooldown according to the number of identical weapons
          ids[id].forEach((weaponToAdjust) => {
            if (weaponToAdjust === weapon) return;
            weaponToAdjust.increaseCooldown(instanceDelay);
          });
        }

        weapon.setManager(this);
        this.weapons.push(weapon);
      });
  },

  /**
   * updates weapons on every tick if needed
   * @param {boolean} authoritative Determines whether the user is authoritative or not
   * @return {void}
   */
  update(authoritative) {
    // non authoritative players don't need to exectue these'
    if (!authoritative) return;

    this.weapons.forEach((weapon) => {
      weapon.update();
    });
  },

  /**
   * Resets the targets of the weapons
   * @return {void}
   * */
  clearTargetEntity() {
    this.weapons.forEach((weapon) => {
      weapon.clearTargetEntity();
    });
    this._lastEntityAttacked = null;
    this.targetEntityWillBeSet = false;
  },

  /**
   * Sets the target for all the weapon to the given entity
   * @param {object} targetEntity Entity instance
   * @return {void}
   */
  setTargetEntity(targetEntity) {
    this.weapons.filter(weapon => !weapon.isSelfContained()).forEach((weapon) => {
      weapon.setTargetEntity(targetEntity);
    });
  },

  /**
   * Returns a boolean that indicates whether the entity has a target entity
   * @return {boolean}
   */
  hasTargetEntity() {
    for (let i = 0, l = this.weapons.length - 1; i < l; i += 1) {
      if (this.weapons[i].isSelfContained()) continue;
      if (this.weapons[i].getTargetEntity()) return true;
    }
    return false;
  },

  /**
   * Returns the first valid target by looping through the weapons
   * @return {object} Entity instance
   */
  getTargetEntity() {
    for (let i = 0, l = this.weapons.length; i < l; i += 1) {
      const targetEntity = this.weapons[i].getTargetEntity();
      if (targetEntity) return targetEntity;
    }
    return null;
  },

  /**
   * Returning an array of IDs each of representing a weapon
   * @return {array} A collection of weapons the entity is in a possesion of
   */
  getWeapons() {
    return this.weapons;
  },

  /**
   * Returns the entity possessing this very instance
   * @return {object} an entity instance
   */
  getEntity() {
    return this.entity;
  },

  /**
   * Returns an array of weapon instances that can execute their attached fire logic
   * with relation to the given target entity
   * @param {object} target Entity instance
   * @return {array} list of weapon instances the can fire the target
   */
  getWeaponsCanFireEntity(target) {
    if (!target) return [];
    const distance = Util.distanceBetween(this.entity, target);
    return this.weapons.filter(weapon => weapon.isReady() && weapon.getRange() >= distance);
  },

  /**
   * Returns the range the entity must close on the target
   * in order to make all weapons able to fire
   * @return {integer} the calcualted range in pixels
   */
  getMinRange() {
    if (!this.minRange) {
      this.minRange = this.weapons.reduce((min, weapon) => {
        let range;
        // self contained weapons don't participate in this calculations
        if (weapon.isSelfContained()) return min;

        if (!weapon.isOffensive()) return min;

        range = weapon.getRange();
        if (!range) return min;
        if (range < min) return range;

        return min;
      }, 9999);
    }
    return this.minRange;
  },

  /**
   * Returns the range the entity must close on the target
   * in order to make all weapons able to fire
   * @return {integer} the calcualted range in pixels
   */
  getMaxRange() {
    if (!this.maxRange) {
      this.maxRange = this.weapons.reduce((max, weapon) => {
        const range = weapon.getRange();
        if (range > max) return range;
        return max;
      }, 0);
    }
    return this.maxRange;
  },

  /**
   * Returns whether the entity has any sort of weapon that can damage a hostile enemy
   * @return {boolean}
   */
  hasOffensiveWeapon() {
    if (this._hasOffensiveWeapon === undefined) {
      for (let i = this.weapons.length - 1; i >= 0; i -= 1) {
        if (this.weapons[i].isOffensive()) {
          this._hasOffensiveWeapon = true;
          break;
        }
      }
    }
    return this._hasOffensiveWeapon;
  },

  /**
   * Returns whether the entity has any weapon with the given id
   * @return {Boolean}
   */
  hasWeapon(id) {
    if (!id) return false;
    for (let i = this.weapons.length - 1; i >= 0; i -= 1) {
      if (this.weapons[i].getId() === id) {
        return true;
      }
    }
    return false;
  },

  /**
   * Returns if any of the weapons can fire their target entity
   * @return {boolean}
   */
  hasCAF() {
    if (undefined === this._hasCAF) {
      this._hasCAF = this.weapons.some(weapon => weapon.canAttackFighters());
    }
    return this._hasCAF;
  },

  /**
   * Returns if any of the weapons can fire their target entity
   * @return {boolean}
   */
  isWeaponReadyToFireTarget() {
    if (!this.hasTargetEntity()) return false;
    return this.weapons.some(weapon => weapon.couldBeReleased());
  },
};

// exposes Constant like ID variables
WeaponManager.WEAPON_DOCK = 6;

export default WeaponManager;
