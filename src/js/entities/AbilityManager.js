const abilitiesJSON = require('../../assets/datas/common/abilities');

/**
 * Constructor function to initialise the AbilityManager
 * @param {[object]} entity [The target entity whose attributes will be tested]
 */
function AbilityManager(entity) {
  this.init(entity);
  this.testAbilities();
}

AbilityManager.prototype = {
  /**
   * Initialising the helper variables of the manager instance
   * @param  {[object]} entity [Entity instance]
   * @return {[void]}
   */
  init(entity) {
    this.abilities = [];

    this.entity = entity;
    this.dataObject = entity.getDataObject();
    this.weaponManager = entity.getWeaponManager();
  },

  /**
   * Determining which abilities the entity possess according to its datas
   * @return {[void]}
   */
  testAbilities() {
    if (this.canMove()) {
      this.abilities = this.abilities.concat([
        abilitiesJSON.move,
        abilitiesJSON.stop,
        abilitiesJSON.follow,
        abilitiesJSON.patrol,
        abilitiesJSON.hold,
        abilitiesJSON.defend,
      ]);
    }

    if (this.canAttack()) {
      this.abilities.push(abilitiesJSON.attack);
    }

    if (this.canDock()) {
      this.abilities.push(abilitiesJSON.dock);
    }

    if (this.isDockable()) {
      this.abilities.push(abilitiesJSON.undock);
    }
  },

  /**
   * Returning true if the entity can alter its positions
   * @return {[booelan]} true if the entity can alter its positions
   */
  canMove() {
    return this.dataObject.getSpeed() > 0;
  },

  /**
   * Returns whether the entity can attack hostile entities
   * @return {boolean}
   */
  canAttack() {
    if (this.weaponManager.hasOffensiveWeapon()) {
      return true;
    }
    return false;
  },

  /**
   * Returns whether the entity can dock into other entities
   * @return {boolean}
   */
  canDock() {
    return this.entity.canDock();
  },

  /**
   * Returns whether the entity has a repair dock and therefore able to
   * inhabit entities
   * @return {boolean}
   */
  isDockable() {
    return this.entity.isDockable();
  },

  /**
   * Returning an array of IDs each of representing an ability
   * the entity is capable of
   * @return {[Array]} A collection of abilities the entity is in a possesion of
   */
  getAbilities() {
    return this.abilities;
  },
};

export default AbilityManager;
