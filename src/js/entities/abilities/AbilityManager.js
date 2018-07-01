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
        'move',
        'stop',
        'follow',
        'patrol',
        'hold',
        'defend',
      ]);
    }

    if (this.canAttack()) {
      this.abilities.push('attack');
    }

    if (this.canDock()) {
      this.abilities.push('dock');
    }

    if (this.isDockable()) {
      this.abilities.push('undock');
    }

    if (this.canMine()) {
      this.abilities.push('mining');
    }

    if (this.canProduce()) {
      this.abilities = this.abilities.concat(this.getProducableEntitesAsAbilities());
    }

    if (this.canConstruct()) {
      this.abilities.push('constructionPage');
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
   * Returns whether the entity can mine resources
   * @return {boolean}
   */
  canMine() {
    return this.entity.canMine();
  },

  /**
   * Returns whether the entity can produce other entities
   * @return {boolean}
   */
  canProduce() {
    const DO = this.dataObject;
    return DO.getProduction() && DO.getProduction().length;
  },

  /**
   * Returns whether the entity can consruct buildings type entities
   * @return {boolean}
   */
  canConstruct() {
    const DO = this.dataObject;
    return DO.getConstruction() && DO.getConstruction().length;
  },
  /**
   * Returns the array of entity IDs
   * @return {object} array of entity IDs
   */
  getProducableEntitesAsAbilities() {
    const DO = this.dataObject;
    return DO.getProduction();
  },

  /**
   * Returns true if the given entity's production queue is not empty
   * @return {boolean}
   */
  isProducing() {
    return this.entity.isProducing();
  },

  /**
   * Returns an array of IDs each of representing an ability
   * the entity is capable of
   * Returns an empty array if the entity has no user control
   * @return {[Array]} A collection of abilities the entity is in a possesion of
   */
  getAbilities() {
    if (this.entity.hasNoUserControl()) return [];
    return this.abilities;
  },
};

export default AbilityManager;
