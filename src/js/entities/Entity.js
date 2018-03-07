/* global window, Phaser */
/* eslint no-underscore-dangle: 0 */
import PlayerManager from '../players/PlayerManager';
import EventEmitter from '../sync/EventEmitter';
import ActivityManager from '../entities/activities/ActivityManager';
import MotionManager from '../entities/motions/MotionManager';
import AbilityManager from '../entities/AbilityManager';
import WeaponManager from '../entities/weapons/WeaponManager';
import EffectManager from '../effects/EffectManager';
import GUI from '../gui/GUI';
import GUIActivityManager from '../gui/ActivityManager';
import UserKeyboard from '../gui/UserKeyboard';
import UserPointer from '../gui/UserPointer';
import Util from '../common/Util';
import Graphics from '../common/Graphics';
import * as Const from '../common/Const';

const ns = window.fivenations;

/**
 * Registers animations sequences against the given sprite object if there is any
 * specified in the DO
 * @param  {object} sprite [Phaser.Sprite object to get extended with animations]
 * @param  {object} dataObject [DataObject instance that may contain animation sequences defined]
 * @return {void}
 */
const extendSpriteWithAnimations = (sprite, dataObject) => {
  const animations = dataObject.getAnimations();
  const animationOffset = dataObject.getAnimationOffset();
  sprite.frame = animationOffset;
  if (!animations || typeof animations !== 'object') return;
  Object.keys(animations).forEach((key) => {
    const data = animations[key];
    if (data.length) {
      data.forEach((animationData, idx) => {
        const frames = animationData.frames.map(v => v + animationOffset);
        sprite.animations.add(
          key + idx,
          frames,
          animationData.rate,
          animationData.loopable,
        );
      });
    } else {
      const frames = data.frames.map(v => v + animationOffset);
      sprite.animations.add(key, frames, data.rate, data.loopable);
    }
    // if the animation is called `idle-forever` it is started straightaway
    if (key === Const.ANIMATION_IDLE_FOREVER) {
      sprite.animations.play(key);
    }
  });
};

/**
 * Extending the given sprite with event listeners
 * @param {object} entity - Entity object that owns the [sprite] Phaser.Sprite
 * instance
 * @param {object} sprite - Phaser.Sprite object to which the extended
 * properties and child elements will be linked
 * @param {object} dataObject - DataObject instance containing all the
 * informations about the entity being instantiated
 * @return {object}
 */
const extendSpriteWithEventListeners = (entity, sprite, dataObject) => {
  // input events registered on the sprite object
  sprite.events.onInputDown.add(function onInputDown() {
    let now;

    if (GUIActivityManager.getInstance().hasActiveSelection()) {
      return;
    }

    if (UserPointer.getInstance().isLeftButtonDown()) {
      // If the user holds SHIFT we will extend the number of selected entities
      if (!UserKeyboard.getInstance().isDown(Phaser.KeyCode.SHIFT)) {
        this.entityManager.unselectAll();
      }
      this.select();

      now = new Date().getTime();
      if (now - this.lastClickTime < 500) {
        this.entityManager
          .entities()
          .filter((targetEntitity) => {
            // If the targetEntitity is off screen we need to exclude
            if (
              !Util.between(
                targetEntitity.getSprite().x - this.game.camera.x,
                0,
                ns.window.width,
              )
            ) {
              return false;
            }
            if (
              !Util.between(
                targetEntitity.getSprite().y - this.game.camera.y,
                0,
                ns.window.height,
              )
            ) {
              return false;
            }
            // we need to include only the indentical entities
            return (
              targetEntitity.getDataObject().getId() === dataObject.getId()
            );
          })
          .forEach((targetEntitity) => {
            targetEntitity.select();
          });
      }

      // this needs to be attached to the individual sprite instance
      this.lastClickTime = now;
    }
  }, entity);

  sprite.events.onInputOut.add(() => {
    sprite.hover = false;
  });

  sprite.events.onInputOver.add(() => {
    sprite.hover = true;
  });
};

/**
 * Initialising the Phaser.Sprite object with all the additional child elements
 * such as selector and property bars
 * @param {object} entity - Entity object that owns the Phaser.Sprite
 * @param {object} [sprite] Phaser.Sprite object to which the extended properties
 * and child elements will be linked
 * @param {object} [dataObject] [DataObject instance containing all the
 * informations about the entity being instantiated]
 * @return {object}
 */
const extendSprite = (entity, sprite, dataObject) => {
  // dimensions
  const origWidth = dataObject.getWidth();
  const origHeight = dataObject.getHeight();
  const damageWidth = dataObject.getDamageWidth();
  const damageHeight = dataObject.getDamageHeight();

  // rendering group name
  const groupName = dataObject.isBuilding()
    ? Const.GROUP_ENTITIES_BUILDINGS
    : Const.GROUP_ENTITIES;

  // choosing the group for entities so that other elements will be obscured by them
  // it's kind of applying zIndex on entities
  const group = Graphics.getInstance().getGroup(groupName);

  // actiavting the ARCADE physics on the sprite object
  entity.game.physics.enable(sprite, Phaser.Physics.ARCADE);

  // Set up the Phaser.Sprite object
  sprite.anchor.setTo(0.5, 0.5);

  // enabling input events applied on the sprite object
  sprite.inputEnabled = true;

  // helper variable for storing whether the input is over the sprite
  sprite.hover = false;

  // sets the animations defined in the DO
  extendSpriteWithAnimations(sprite, dataObject);

  // applying event listeners on the passed sprite object
  extendSpriteWithEventListeners(entity, sprite, dataObject);

  // coords
  sprite.x = 0;
  sprite.y = 0;

  // reducing the hitArea according to the one specified in the realated DataObject
  sprite.hitArea = new Phaser.Rectangle(
    origWidth / -2,
    origHeight / -2,
    origWidth,
    origHeight,
  );

  // save helper data for faster updates for any subsequent calculation with damage area
  sprite._damageWidth = damageWidth * 0.5;
  sprite._damageHeight = damageHeight * 0.5;
  sprite._damageWidthWithShield = Math.round(damageWidth);
  sprite._damageHeightWithShield = Math.round(damageHeight);

  sprite._parent = entity;

  group.add(sprite);
  sprite._group = group;

  return sprite;
};

class Entity {
  /**
   * generates an Entity instance
   * @param {object} config [configuration object]
   * @example
   * new Entity({
   *     id:              [unique GUID for the entity]
   *     entityManager:   [Instance of the EntityManager]
   *     sprite:          [preinitialised Phaser.Sprite]
   *     dataObject:      [A instance of DataObject]
   * });
   */
  constructor(config) {
    const gui = GUI.getInstance();

    // timestamp of creation to syncronize events across remote clients
    this.createdAt = config.createdAt;
    this._lastShieldUpdate = this.createdAt;

    // storing entityManager locally to prevent recursive mutual dependency
    this.entityManager = config.entityManager;

    // retrive the Phaser.Game object
    this.game = config.entityManager.getGame();

    // unique identifier in order to obtain the very entity
    this.guid = config.guid;

    // setting up the dataObject
    this.dataObject = config.dataObject;

    // setting up the EventDisatcher
    this.eventDispatcher = new Util.EventDispatcher();

    // persisting the sprite object and attaching it to the Entity object
    this.sprite = extendSprite(this, config.sprite, config.dataObject);

    // adding the Selector object to highligh whether the unit is seleted or not
    this.selector = gui.addSelector(this);

    // adding the StatusDisplay object to show the current status
    // of the entity's attributes
    this.statusDisplay = gui.addStatusDisplay(this);

    // energy shield animation
    this.energyShield = this.entityManager.addEnergyShield(this);

    // ActivityManager
    this.activityManager = new ActivityManager(this);

    // MotionManager for altering the coordinates of the entity
    this.motionManager = new MotionManager(this);

    // WeaponManager for handling wepon objects an entity is in a possesion of
    this.weaponManager = new WeaponManager(this);

    // AbilityManager for determining which abilities are available for this entity
    this.abilityManager = new AbilityManager(this);

    // Player instance
    this.player = PlayerManager.getInstance().getPlayerByTeam(this.dataObject.getTeam());

    // color indicator sprite
    if (!this.player.isIndependent()) {
      this.colorIndicator = gui.addColorIndicator(this);
    }

    // initialise collision area
    this.updateDamageArea();

    // add jet engine sprite
    if (this.dataObject.hasJetEngine()) {
      this.jetEngine = this.entityManager.addJetEngine(this);
    }
  }

  /**
   * registering custom callbacks to the passed events
   * @param  {string}   event
   * @param  {Function} callback
   * @return {void}
   */
  on(event, callback) {
    this.eventDispatcher.addEventListener(event, callback);
  }

  /**
   * removing custom callbacks to the passed events
   * @param  {string}   event
   * @param  {Function} callback
   * @return {void}
   */

  off(event, callback) {
    this.eventDispatcher.removeEventListener(event, callback);
  }

  /**
   * Updates the entity's state
   * @return {void}
   */
  update(authoritative) {
    // self-contained modules
    this.activityManager.update();

    if (!ns.mapEditorMode) {
      this.motionManager.update();
      this.weaponManager.update(authoritative);
    }

    // local behaviour
    this.updateShield();
  }

  /**
   * Updates the entity's shield at regular intervals (synced)
   */
  updateShield() {
    const timeElapsedSinceLastUpdate =
      this.game.time.time - this._lastShieldUpdate;

    if (this.dataObject.getMaxShield() === 0) return;

    // update the entity's shield by one unit at every second
    if (timeElapsedSinceLastUpdate > Const.SHIELD_CHARGE_RATE_IN_MILLISECONDS) {
      let expectedTick =
        Math.floor(timeElapsedSinceLastUpdate / Const.SHIELD_CHARGE_RATE_IN_MILLISECONDS) || 0;
      // if there is more execution to be triggered we update the shield accordingly
      while (expectedTick) {
        this.dataObject.restoreShield(1);
        expectedTick -= 1;
      }
      this._lastShieldUpdate = this.game.time.time;

      this.updateDamageArea();
    }
  }

  /**
   * updates the collision area of the entity according to whether or not
   * it has shield
   */
  updateDamageArea() {
    const shield = this.dataObject.getShield();
    if (this._lastShieldValue === shield) return;

    if (shield < Const.SHIELD_ACTIVITY_TRESHOLD) {
      this.sprite.body.setSize(
        this.sprite._damageWidth,
        this.sprite._damageHeight,
        0,
        0,
      );
    } else {
      this.sprite.body.setSize(
        this.sprite._damageWidthWithShield,
        this.sprite._damageHeightWithShield,
        0,
        0,
      );
    }

    this._lastShieldValue = shield;
  }

  /**
   * Altering the entity's position
   * @param  {[integer]} targetX [description]
   * @param  {[integer]} targetY [description]
   * @return {[void]}
   */
  moveTo(targetX, targetY) {
    const move = new ActivityManager.Move(this);
    move.setCoords({ x: targetX, y: targetY });
    this.activityManager.add(move);
  }

  /**
   * adds the Stop activity to the activity buffer
   * @return {void}
   */
  stop() {
    const stop = new ActivityManager.Stop(this);
    this.activityManager.add(stop);
  }

  /**
   * Register the Patrol activity in the entity's ActivityManager instance
   * with the given parameters
   * @param  {integer} x [horizontal constituent of the coordinate between which the entity patrols]
   * @param  {integer} y [vertical constituent of the coordinate between which the entity patrols]
   * @return {void}
   */
  patrol(x, y) {
    const patrol = new ActivityManager.Patrol(this);
    patrol.setStartPoint(this.sprite.x, this.sprite.y);
    patrol.setDestionation(x, y);
    this.activityManager.add(patrol);
  }

  /**
   * Register the Follow activity inthe entity's ActivityManager instance
   * @param  {object} targetEntity [Entity]
   * @return {void}
   */
  follow(targetEntity) {
    const follow = new ActivityManager.Follow(this);
    follow.setTarget(targetEntity);
    this.activityManager.add(follow);
  }

  /**
   * Registers a Fire activity with the given entity set as target
   * @param  {object} targetEntity [Entity]
   * @return {void}
   */
  fire(targetEntity, weapons) {
    const fire = new ActivityManager.Fire(this);
    fire.setTarget(targetEntity);
    fire.setWeapons(weapons);
    this.activityManager.add(fire);
  }

  /**
   * Registers a GetInRange activity with the given entity set as target
   * @param  {object} targetEntity [Entity]
   * @return {void}
   */
  getInRange(targetEntity) {
    const getInRange = new ActivityManager.GetInRange(this);
    getInRange.setTarget(targetEntity);
    this.activityManager.add(getInRange);
  }

  /**
   * Registers a GetToDock activity with the given entity set as target
   * @param  {object} targetEntity
   * @param {boolean} addAsLast - Registers the activity as the last to excecute
   * @return {void}
   */
  getToDock(targetEntity, addAsLast) {
    const getToDock = new ActivityManager.GetToDock(this);
    getToDock.setTarget(targetEntity);
    this.activityManager.add(getToDock, addAsLast);
  }

  /**
   * Registers a Attack activity with the given entity set as target
   * @param {object} targetEntity
   * @param {boolean} addAsLast - Registers the activity as the last to excecute
   * @return {void}
   */
  attack(targetEntity, addAsLast) {
    const attack = new ActivityManager.Attack(this);
    attack.setTarget(targetEntity);
    this.activityManager.add(attack, addAsLast);
    this.weaponManager.setTargetEntity(targetEntity);
  }

  /**
   * Registers a RotateToTarget activity with the given entity set as target
   * @param  {object} targetEntity [Entity]
   * @return {void}
   */
  rotateToTarget(targetEntity) {
    const rotate = new ActivityManager.RotateToTarget(this);
    rotate.setTarget(targetEntity);
    this.activityManager.add(rotate);
  }

  /**
   * Adds the given entity to the container for docked entities
   * @param {object} targetEntity [Entity]
   * @return {void}
   */
  dockTarget(targetEntity) {
    if (this.getNumberOfDockerEntities() >= this.dataObject.getMaxHangar()) {
      return;
    }
    targetEntity.hibernate();
    if (this.docker === undefined) {
      this.docker = [];
    }
    targetEntity.unselect();
    targetEntity.reset();
    this.docker.push(targetEntity);
  }

  /**
   * Reactivates all the entities that have been enclosed into the docker array
   * @return {void}
   */
  undock() {
    if (this.docker === undefined) return null;

    const entitiesToRelease = [];

    this.docker.forEach((entity) => {
      entity.reactivate();
      entitiesToRelease.push(entity);
    });
    this.docker = [];

    return entitiesToRelease;
  }

  /**
   * Alters entity attributes according to the given parameters
   * @param {object} params
   */
  damage(params) {
    this.dataObject.damage(params);
    this.updateDamageArea();

    if (this.dataObject.getHull() <= 0) {
      this.entityManager.remove(this);
    } else {
      this.eventDispatcher.dispatch('damage');
    }
  }

  /**
   * Revelas the fog of war tile that the entity is belonged to
   */
  revealEntityInFogOfWar() {
    const { map } = ns.game;
    const fogOfWar = map.getFogOfWar();
    fogOfWar.forceVisit(...this.getTile(map));
  }

  /**
   * Removes all activity from the ActivityManager instance
   * @return {void}
   */
  reset() {
    this.activityManager.removeAll();
    this.weaponManager.clearTargetEntity();
  }

  /**
   * Triggers the remove event and creates and explosion with
   * removing the entity from the gameplay
   * @return {void}
   */
  remove() {
    this.delete();
    if (!ns.mapEditorMode) {
      EffectManager.getInstance().explode(this);
    }
  }

  /**
   * Removes the entity from the gameplay
   * @return {[type]} [description]
   */
  delete() {
    this.eventDispatcher.dispatch('remove');
    this.sprite._group.remove(this.sprite);
    this.sprite.destroy();
  }

  /**
   * Makes the entity unavailable for further actions including
   * rendering it into the gameplay without removing it completely. This is
   * usually used to actions such as docking into another entity.
   */
  hibernate() {
    this.sprite.visible = false;
    this.hibarnated = true;
    this.eventDispatcher.dispatch('hibernate');
  }

  /**
   * Makes the entity unavailable for further actions including
   * rendering it into the gameplay without removing it completely. This is
   * usually used to actions such as docking into another entity.
   */
  reactivate() {
    this.sprite.visible = true;
    this.hibarnated = false;
    this.eventDispatcher.dispatch('reactivated');
  }

  /**
   * Sets the given animation to be played through the
   * animation manager Phaser exposes
   * @param {string} key identifier of the animation to be played
   * @return {void}
   */
  animate(key) {
    const angleCode = this.motionManager.getCurrentAngleCode();
    const keyWithAngleCode = key + angleCode;
    let animationKey;
    if (this.sprite.animations.getAnimation(keyWithAngleCode)) {
      animationKey = keyWithAngleCode;
    } else if (this.sprite.animations.getAnimation(key)) {
      animationKey = key;
    }
    if (animationKey) {
      this.sprite.animations.play(animationKey);
    }
  }

  /**
   * Stops current animations from being played and reset the frame counter
   * @return {void}
   */
  stopAnimation() {
    if (!this.sprite.animations.currentAnim) return;
    // idle-forever animation cannot be stopped
    if (
      this.sprite.animations.currentAnim.name === Const.ANIMATION_IDLE_FOREVER
    ) {
      return;
    }
    this.sprite.animations.stop(null, true);
  }

  /**
   * Selects entity
   * @return {void}
   */
  select() {
    if (this.isHibernated()) return;

    if (
      this.entityManager.entities(':selected').length <
      Const.MAX_SELECTABLE_UNITS
    ) {
      this.selected = true;
      this.eventDispatcher.dispatch('select');
      EventEmitter.getInstance().local.dispatch('gui/selection/change');
    }
  }

  /**
   * Selects the entity as a target of another entity
   * @return {void}
   */
  selectedAsTarget() {
    this.eventDispatcher.dispatch('selectedAsTarget');
  }

  /**
   * Unselects entity
   * @return {void}
   */
  unselect() {
    this.selected = false;
    this.eventDispatcher.dispatch('unselect');
    EventEmitter.getInstance().local.dispatch('gui/selection/change');
  }

  /**
   * Start a constant floating animation
   * @return {void}
   */
  levitate() {
    if (this.dataObject.isBuilding()) return;
    this.motionManager.levitate();
  }

  /**
   * Stops the floating animation
   */
  stopLevitating() {
    if (this.dataObject.isBuilding()) return;
    this.motionManager.stopLevitating();
  }

  /**
   * Sets the given entity as the closest hostile entity in attack range of this entity
   * @param {object} entity Closest entity that is in a hostile relation with the one
   * initiated the call
   * @param {object} Entity
   */
  setClosestHostileEntityInRange(entity) {
    this.closestHostileEntity = entity;
  }

  /**
   * Returns the closest entity that can be attacked
   * @param {object} Entity
   */
  setClosestAttackableHostileEntity(entity) {
    this.closestAttackableHostileEntity = entity;
  }

  /**
   * Sets the given entity as the closest ally entity in attack range of this entity
   * @param {object} entity Closest entity that is an ally of the one initiated the call
   * return {object} Entity
   */
  setClosestAllyEntityInRange(entity) {
    this.closestAllyEntity = entity;
  }

  /**
   * Fires the given event against the entity
   * @param {string} event - event id to be fired
   */
  dispatch(event) {
    this.eventDispatcher.dispatch(event);
  }

  hasSlowManeuverability() {
    return (
      this.getDataObject().getManeuverability() <
      Const.SLOW_MANOUVERABAILITY_TRESHOLD
    );
  }

  isSelected() {
    return !!this.selected;
  }

  isHover() {
    return this.sprite.input.pointerOver();
  }

  isInside(obj) {
    if (this.sprite.x + this.getDataObject().getWidth() / 2 < obj.x) {
      return false;
    }
    if (
      this.sprite.x - this.getDataObject().getWidth() / 2 >
      obj.x + obj.width
    ) {
      return false;
    }
    if (this.sprite.y + this.getDataObject().getHeight() / 2 < obj.y) {
      return false;
    }
    if (
      this.sprite.y - this.getDataObject().getHeight() / 2 >
      obj.y + obj.height
    ) {
      return false;
    }
    return true;
  }

  /**
   * returns true if the entity is controlled by the current user
   * @return {Boolean}
   */
  isEntityControlledByUser(player) {
    const p = player || PlayerManager.getInstance().getUser();
    if (!p) return false;
    return this.getDataObject().getTeam() === p.getTeam();
  }

  /**
   * Returns whether the given entity is hostile or not
   * @param  {object} entity Entity instance
   * @return {Boolean} true if the given entity is hostile
   */
  isEnemy(entity) {
    const playerManager = PlayerManager.getInstance();
    const thisPlayer = this.getPlayer();
    const thatPlayer = entity.getPlayer();
    if (thisPlayer === thatPlayer) return false;
    return playerManager.isPlayerHostileToPlayer(thisPlayer, thatPlayer);
  }

  /**
   * Returns wether the entity can be a target of other entities
   * @return {Boolean} true if the entity is targetable
   */
  isTargetable() {
    return !this.isHibernated();
  }

  /**
   * Returns wether the entity can be targeted by the given entity
   * @param {object} entity - Entity
   * @return {Boolean} true if the entity is targetable
   */
  isTargetableByEntity(entity) {
    if (!this.isTargetable()) return false;

    // check whether the give entity can attack fighters
    if (this.getDataObject().isFighter()) {
      const hasCAF = entity.getWeaponManager().hasCAF();
      if (!hasCAF) return false;
    }

    return true;
  }

  /**
   * Returns whether the entity is active or not
   * @return {Boolean}
   */
  isHibernated() {
    return !!this.hibarnated;
  }

  /**
   * Returns wether the entity can take fighters in
   * @return {Boolean}
   */
  isDockable() {
    if (this.dockable === undefined) {
      this.dockable = this.dataObject.getMaxHangar() > 0;
    }
    return this.dockable;
  }

  /**
   * Returns wether the entity can dock
   * @return {Boolean}
   */
  canDock() {
    if (this.isAbleToDock === undefined) {
      this.isAbleToDock = this.dataObject.isFighter();
    }
    return this.isAbleToDock;
  }

  /**
   * Returns whether the entity can move or not
   * @return {Boolean}
   */
  canMove() {
    return this.dataObject.getSpeed() > 0;
  }

  getSprite() {
    return this.sprite;
  }

  getDataObject() {
    return this.dataObject;
  }

  getActivityManager() {
    return this.activityManager;
  }

  getMotionManager() {
    return this.motionManager;
  }

  getAbilityManager() {
    return this.abilityManager;
  }

  getWeaponManager() {
    return this.weaponManager;
  }

  getPlayer() {
    return this.player;
  }

  getGUID() {
    return this.guid;
  }

  getAnimationManager() {
    return this.sprite.animations;
  }

  getAnimationByKey(key) {
    const animations = this.getAnimations();
    if (!animations) {
      return null;
    }
    return animations.getAnimation(key);
  }

  getTile(map) {
    const sprite = this.getSprite();
    const tileSize = map.getTileWidth();
    const x = Math.floor(sprite.x / tileSize);
    const y = Math.floor(sprite.y / tileSize);
    this._previousTile = [x, y];
    return this._previousTile;
  }

  getPreviousTile() {
    return this._previousTile;
  }

  getDockedEntities() {
    return this.docker;
  }

  getNumberOfDockerEntities() {
    if (!this.docker) {
      return 0;
    }
    return this.docker.length;
  }

  /**
   * Returns the closest entity that is in hostile relation to the one triggered the function call
   * @return {object} Entity
   */
  getClosestHostileEntityInRange() {
    return this.closestHostileEntity;
  }

  /**
   * Returns the closest entity that can be attacked
   * @return {object} Entity
   */
  getClosestAttackableHostileEntity() {
    return this.closestAttackableHostileEntity;
  }

  /**
   * Returns the closest entity that is in alliance with the current entity
   * @return {object} Entity
   */
  getClosestAllyEntityInRange() {
    return this.closestAllyEntity;
  }

  /**
   * Returns the timestamp of when the entity was generated
   * @return {integer}
   */
  getCreationTime() {
    return this.createdAt;
  }

  /**
   * Returns the horizontal and vertical offset of the particles
   * emitted by the entity so that they appear on the right
   * position according to the current heading of the entity object
   * @return {object} - {x, y}
   */
  getProjectileOffsetByHeading() {
    const projectileOffset = this.dataObject.getProjectileOffset();
    if (!projectileOffset.length) return projectileOffset;
    const angleCode = this.motionManager.getCurrentAngleCode();
    return projectileOffset[angleCode] || {};
  }
}

export default Entity;
