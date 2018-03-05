import Activity from './Activity';

const ns = window.fivenations;

/**
 * Fire Activity that executes each of individual weapon's fire
 * function
 */
class Fire extends Activity {
  /**
   * @param {object} entity Instance of an Entity class
   */
  constructor(entity) {
    super();
    this.entity = entity;
    this.targetEntity = null;
    this.weapons = [];
  }

  /**
   * applies the activity on an entity
   */
  activate() {
    super.activate();

    if (this.hasTarget() && this.hasWeapons()) {
      this.launchAllWeapons();
      this.revealFogOfWarTile();
    }

    this.kill();
  }

  /**
   * Returns whether the Activity has a valid target defined
   * @return {boolean}
   */
  hasTarget() {
    return this.targetEntity;
  }

  /**
   * Returns whether the Activity has weapons attached to them
   * @return {boolean}
   */
  hasWeapons() {
    return this.weapons.length;
  }

  /**
   * Cycles through all added weapons and calls their fire function
   */
  launchAllWeapons() {
    this.weapons.forEach((weapon) => {
      weapon.fire(this.targetEntity);
    });
  }

  /**
   * Reveals the relevant FogOfWar tile if the target belongs to the User
   */
  revealFogOfWarTile() {
    if (this.isTargetControlledByUser()) {
      const fogOfWar = ns.game.map.getFogOfWar();
      this.targetEntity.revealEntityInFogOfWar(fogOfWar);
    }
  }

  /**
   * Returns whether the target belongs to the User
   * @return {boolean}
   */
  isTargetControlledByUser() {
    return this.targetEntity.isEntityControlledByUser();
  }

  /**
   * Saves the target to which the entity will be moved
   * @param {object} entity - Entity instance
   */
  setTarget(entity) {
    this.targetEntity = entity;
  }

  /**
   * Sets the weapons to be fired at the given target
   * @param {array} weapons List of weapon instances
   */
  setWeapons(weapons) {
    this.weapons = Array.prototype.concat.call(this.weapons, weapons);
  }
}

export default Fire;
