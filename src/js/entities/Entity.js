/* global window, Phaser */
/* eslint no-underscore-dangle: 0 */
import DataObject from '../model/DataObject';
import PlayerManager from '../players/PlayerManager';
import EventEmitter from '../sync/EventEmitter';
import ActivityManager from './activities/ActivityManager';
import MotionManager from './motions/MotionManager';
import AbilityManager from './AbilityManager';
import WeaponManager from './weapons/WeaponManager';
import ProductionManager from './production/ProductionManager';
import EffectManager from '../effects/EffectManager';
import CollisionMapMasks from '../map/CollisionMapMasks';
import GUI from '../gui/GUI';
import GUIActivityManager from '../gui/ActivityManager';
import UserKeyboard from '../gui/UserKeyboard';
import UserPointer from '../gui/UserPointer';
import Util from '../common/Util';
import Graphics from '../common/Graphics';
import CallbackCollection from '../common/CallbackCollection';
import * as Const from '../common/Const';

const ns = window.fivenations;

/**
 * Returns details about the dimensions that the given entity
 * might occupy in the collision map
 * @param {object} sprite [Phaser.Sprite object to get extended with animations]
 * @param {object} dataObject [DataObject instance that may contain animation sequences defined]
 * @return {object}
 */
function getEntityDimensionsForVisitingTiles(sprite, dataObject) {
  const isBuilding = dataObject.isBuilding() || dataObject.isSpaceObject();
  let width = 1;
  let height = 1;

  if (isBuilding) {
    width =
      Math.max(Math.floor(sprite.hitArea.width / Const.TILE_WIDTH), 1) + 1;
    height =
      Math.max(Math.floor(sprite.hitArea.height / Const.TILE_HEIGHT), 1) + 1;
  }

  return {
    offsetX: Math.floor(width / 2),
    offsetY: Math.floor(height / 2),
    width,
    height,
  };
}

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

  // pre-calculate collision data for better performance
  sprite._collision = getEntityDimensionsForVisitingTiles(sprite, dataObject);

  sprite._parent = entity;

  group.add(sprite);
  sprite._group = group;

  return sprite;
};

/**
 * Sets the home station of the give entity and registers listeners
 * @param {object} entity - Entity instance
 * @param {string} guid - guid of the home station entity
 */
function setHomeStation(manager, entity, guid) {
  const homeStation = manager.entities(guid);
  entity.homeStation = homeStation;
  homeStation.deliverer = entity;

  homeStation.on('remove', () => {
    entity.homeStation = null;
  });
  entity.on('remove', () => {
    homeStation.deliverer = null;
  });
}

/**
 * Adds internal private listeners to various entity events
 * @param {object} entity - Entity instance
 */
function addEventListeners(entity) {
  const collisionMap = ns.game.map.getCollisionMap();

  entity.on('initMovement', () => {
    entity.forceUnvisitNextTile(collisionMap);
  });

  entity.on('move', () => {
    entity.forceUnvisitNextTile(collisionMap);
    entity.forceVisitNextTile(collisionMap);
  });

  entity.on('tile/unvisit', () => {
    entity.forceUnvisitNextTile(collisionMap);
  });

  entity.on(
    'damage',
    function () {
      const event = this.dataObject.getEvent('damage');
      if (!event) return;
      const { callbackCollectionId } = event;
      if (callbackCollectionId) {
        CallbackCollection.getInstance().run(callbackCollectionId, this);
      }
    }.bind(entity),
  );
}

/**
 * Executes the predefined "create" event in the DataObject
 * E.g.: "create": {"activity": }
 */
function executeCreateEvent(entity) {
  const dataObject = entity.getDataObject();
  const event = dataObject.getEvent('create');

  if (!event) return;

  const { activities } = event;

  if (!activities || !activities.length) return;

  activities.forEach((config) => {
    const authorised = entity.getPlayer().isAuthorised();
    if (!config.authorisedOnly || authorised) {
      const ActivityClass = ActivityManager.getActivityByString(config.id);
      if (!ActivityClass) return;
      // instantiate the fetched activity and pass this entity
      const activity = new ActivityClass(entity);
      entity.getActivityManager().add(activity);
    }
  });
}

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

    // ProductionManager oversees the production slots of this entity
    this.productionManager = new ProductionManager(this);

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

    // add home station - this is used to mark a link between
    // a deliverer entity and a pick up point such as Icarus and
    // Mining station
    if (config.homeStation) {
      setHomeStation(this.entityManager, this, config.homeStation);
    }

    // no user control
    this.noUserControl = config.noUserControl;

    // execute predefined create event in DataObject
    executeCreateEvent(this);

    // add internal event listeners
    addEventListeners(this);
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
   * registers listner to the given event type that will be
   * execute only once
   * @param {string} event - event type
   * @param {object} callback
   */
  once(event, callback) {
    const ctx = this;
    const once = function once(...args) {
      callback(...args);
      ctx.eventDispatcher.removeEventListener(event, once);
    };
    this.eventDispatcher.addEventListener(event, once);
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
    this.productionManager.update();

    if (!ns.mapEditorMode) {
      this.motionManager.update();
      this.weaponManager.update(authoritative);
    }

    if (ns.debugMode) {
      this.game.debug.body(this.sprite);
    }

    // local behaviour
    this.updateShield();
    this.updateEnergyEmission(authoritative);
  }

  /**
   * Updates the entity's shield at regular intervals (synced)
   */
  updateShield() {
    if (this._lastShieldUpdate === undefined) {
      this._lastShieldUpdate = this.game.time.time;
    }
    const timeElapsedSinceLastUpdate =
      this.game.time.time - this._lastShieldUpdate;

    if (this.dataObject.getMaxShield() === 0) return;

    // update the entity's shield by one unit at every second
    if (timeElapsedSinceLastUpdate > Const.SHIELD_CHARGE_RATE_IN_MILLISECONDS) {
      const expectedTick =
        Math.floor(timeElapsedSinceLastUpdate / Const.SHIELD_CHARGE_RATE_IN_MILLISECONDS) || 0;
      this.dataObject.restoreShield(expectedTick);
      this._lastShieldUpdate = this.game.time.time;
      this.updateDamageArea();
    }
  }

  /**
   * Updates the entity's shield at regular intervals (synced)
   */
  updateEnergyEmission(authoritative) {
    if (this._lastEnergyEmission === undefined) {
      this._lastEnergyEmission = this.game.time.time;
    }

    const energyEmission = this.dataObject.getEnergyEmission();
    const energyEmissionRate = this.dataObject.getEnergyEmissionRate() * 1000; // in ms
    const maxedOut =
      this.player.getEnergy() >= this.player.getMaxEnergyStorage();

    // update only for authoritative player and if the entity has
    // energy emission
    if (!authoritative || !energyEmission) return;

    // if the player's been maxed out at energy we need to
    // update the last energy emission time so that it won't
    // accumulate until the energy falls below maxEnergy
    if (maxedOut) {
      this._lastEnergyEmission = this.game.time.time;
      return;
    }

    const timeElapsedSinceLastUpdate =
      this.game.time.time - this._lastEnergyEmission;

    // update the entity's shield by one unit at every second
    if (timeElapsedSinceLastUpdate > energyEmissionRate) {
      const emitter = EventEmitter.getInstance();
      const expectedTick =
        Math.floor(timeElapsedSinceLastUpdate / energyEmissionRate) || 1;
      emitter.synced.players(this.player).alter({
        energy: energyEmission * expectedTick,
      });
      this._lastEnergyEmission = this.game.time.time;
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
        this.sprite.width / 2 - this.sprite._damageWidth / 2,
        this.sprite.height / 2 - this.sprite._damageWidth / 2,
      );
    } else {
      this.sprite.body.setSize(
        this.sprite._damageWidthWithShield,
        this.sprite._damageHeightWithShield,
        this.sprite.width / 2 - this.sprite._damageWidthWithShield / 2,
        this.sprite.height / 2 - this.sprite._damageHeightWithShield / 2,
      );
    }

    this._lastShieldValue = shield;
  }

  /**
   * Alters the entity's position by executing the Move activity
   * @param {number} targetX - Horizontal coordinate of the target
   * @param {number} targetY - Vertivcal coordinate of the target
   */
  moveTo(targetX, targetY) {
    const move = new ActivityManager.Move(this);
    move.setCoords({ x: targetX, y: targetY });
    this.activityManager.add(move);
  }

  /**
   * Wrapper around "moveTo" function that expects an entity as
   * the parameter instead and calculates its coordinates
   * @param {object} entity - Entity instance to move to
   */
  moveToEntity(entity) {
    const cm = ns.game.map.getCollisionMap();
    const move = new ActivityManager.Move(this);
    let coords;

    // if the entity employs pathfinding algorythm we must
    // determine the closest empty tile that can be taken to
    // approach the entity
    if (this.motionManager.isEmployingPathfinding()) {
      // this returns only the tile coordinates not the screen coordinates
      const tile = cm.getClosestEmptyTileNextToEntityFromEntity(entity, this);
      // if the entity is already there we just terminate the whole execution
      if (Util.areCoordsEqual(tile, this.getTileObj())) {
        return;
      }
      coords = ns.game.map.getScreenCoordinatesOfTile(tile);
    } else {
      // if the entity does not use pathfinding we just send it straight
      // on the top of the target
      coords = entity.getSprite();
    }
    move.setCoords(coords);
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
   * @param {object} targetEntity - Entity
   * @param {boolean} checkIfTargetTooFar
   */
  getInRange(targetEntity, checkIfTargetTooFar) {
    const getInRange = new ActivityManager.GetInRange(
      this,
      checkIfTargetTooFar,
    );
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
   * @param {object} carrierEntity
   * @param {boolean} targetFiring - true if the entity is using target firing
   * @return {void}
   */
  attack(targetEntity, addAsLast, carrierEntity, targetFiring) {
    const attack = new ActivityManager.Attack(this);
    attack.setTarget(targetEntity);
    if (carrierEntity) {
      attack.setCarrierEntity(carrierEntity);
    }
    this.activityManager.add(attack, addAsLast);
    this.weaponManager.setTargetEntity(targetEntity);
    this.targetFiring = targetFiring;
  }

  /**
   * Registers a Mine activity with the given entity (asteroid) set as target
   * @param {object} targetEntity
   * @return {void}
   */
  mine(targetEntity) {
    const mine = new ActivityManager.Mine(this);
    mine.setTarget(targetEntity);
    this.activityManager.add(mine);
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
   * Adds the Delivery Activity to the activity queue
   */
  deliver() {
    const deliver = new ActivityManager.Deliver(this);
    this.activityManager.add(deliver);
  }

  /**
   * Adds the given entity to the container for docked entities
   * @param {object} targetEntity [Entity]
   * @return {void}
   */
  dockTarget(targetEntity) {
    if (this.getNumberOfDockedEntities() >= this.dataObject.getMaxHangar()) {
      return;
    }
    targetEntity.hibernate();
    if (this.docker === undefined) {
      this.docker = [];
    }
    targetEntity.unselect();
    targetEntity.reset();
    this.docker.push(targetEntity);

    this.eventDispatcher.dispatch('updateHangar');
  }

  /**
   * Reactivates all the entities that have been enclosed into the docker array
   */
  undock() {
    if (this.docker === undefined) return null;

    const entitiesToRelease = [];

    this.docker.forEach((entity) => {
      entity.reactivate();
      entitiesToRelease.push(entity);
    });
    this.docker = [];

    this.eventDispatcher.dispatch('updateHangar');

    return entitiesToRelease;
  }

  /**
   * Alters entity attributes according to the given parameters
   * @param {object} params
   * @return {boolean} true if the entity is removed after applying the damage
   */
  damage(params) {
    this.dataObject.damage(params);
    this.updateDamageArea();

    if (this.dataObject.getHull() <= 0) {
      this.entityManager.remove(this);
      return true;
    }

    this.eventDispatcher.dispatch('damage');
    return false;
  }

  /**
   * Registers a Produce activity
   * @param {string} id - Id of the entity to be produced
   */
  produce(id) {
    const targetDO = this.game.cache.getJSON(id);
    const time = targetDO.buildingTime * 1000;
    this.productionManager.addProductionSlot({ id, time });
  }

  /**
   * Cancels the production by the given index
   * @param {number} idx - index of the production element
   */
  cancelProduction(idx = 0) {
    this.productionManager.removeProductionSlotByIndex(idx);
  }

  /**
   * Revelas the fog of war tile that the entity is belonged to
   */
  revealEntityInFogOfWar() {
    const { map } = ns.game;
    const fogOfWar = map.getFogOfWar();
    fogOfWar.forceVisit(...this.getTile());
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
    // releases occupied tiles from the active CollisionMap instance
    const collisionMap = ns.game.map.getCollisionMap();
    collisionMap.unvisitTilesByEntity(this);

    // removes sprite from the relevant Phaser Scene
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
    this._willBeRemoved = true;
    this.eventDispatcher.dispatch('remove', this);
    this.sprite._group.remove(this.sprite);
    this.sprite.destroy();
    this.eventDispatcher.reset();
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
   * @param {string} key - Key of the animation to be terminated
   */
  stopAnimation(key) {
    if (!this.sprite.animations.currentAnim) return;
    const currentAnimKey = this.sprite.animations.currentAnim.name;
    // idle-forever animation cannot be stopped
    if (currentAnimKey === Const.ANIMATION_IDLE_FOREVER) {
      return;
    }
    if (key !== undefined && currentAnimKey !== key) {
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
    if (this.isNotClickable()) return;

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
   * @param {object} entity - Closest entity that is in a hostile relation with the one
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
   * Sets the given array of entities as the closest ally entities
   * @param {array} entities - Closest entities
   */
  setClosestAllyEntitiesInRange(entities) {
    this.closestAllyEntities = entities;
  }

  /**
   * Sets whether there is any obstacle ahead
   * @param {boolean} bool - true if there is any
   */
  setObstacleAhead(bool) {
    this.obstacleAhead = bool;
  }

  /**
   * Sets a suggested tile. It is used to predict on which
   * tile the entity should be sitting according to calculations
   * in other scopes
   * @param {object} tile - { x, y }
   */
  setSuggestedTile(tile) {
    this.suggestedTile = tile;
  }

  /**
   * Sets the control of the unit
   * @param {boolean}
   */
  setNoUserControl(bool) {
    this.noUserControl = bool;
  }

  /**
   * Fires the given event against the entity
   * @param {string} event - event id to be fired
   */
  dispatch(...args) {
    this.eventDispatcher.dispatch(...args);
  }

  /**
   * Replaces the sprite with the a new one with the given id
   * @param {string} spriteId
   */
  replaceSprite(spriteId) {
    const oldSprite = this.sprite;
    const dataSource = this.game.cache.getJSON(spriteId);
    const dataObject = new DataObject(dataSource);
    const sprite = this.game.add.sprite(0, 0, spriteId);

    this.sprite = extendSprite(this, sprite, dataObject);
    this.sprite.x = oldSprite.x;
    this.sprite.y = oldSprite.y;

    this.dispatch('sprite/update', this.sprite);

    oldSprite._group.remove(oldSprite);
    oldSprite.destroy();
  }

  /**
   * Visits a tile regardless of the position of the entity
   * @param {object} collisionMap
   */
  forceVisitNextTile(collisionMap) {
    const tile = this.motionManager.getNextTileToTarget();
    if (!tile) return;
    collisionMap.forceVisit(tile, this);
    this.forceVisitedTile = tile;
  }

  /**
   * Unvisits a tile regardless of the position of the entity
   * @param {object} collisionMap
   */
  forceUnvisitNextTile(collisionMap) {
    if (!this.forceVisitedTile) return;
    collisionMap.forceUnvisit(this.forceVisitedTile, this);
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

  isNotClickable() {
    return this.dataObject.isNotClickable() && !ns.mapEditorMode;
  }

  isHover() {
    return UserPointer.getInstance().isHoverEntity(this);
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
   * @return {boolean}
   */
  isEntityControlledByUser(player) {
    const p = player || PlayerManager.getInstance().getUser();
    if (!p) return false;
    return this.getDataObject().getTeam() === p.getTeam();
  }

  /**
   * Returns whether the given entity is hostile or not
   * @param  {object} entity Entity instance
   * @return {boolean} true if the given entity is hostile
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
   * @return {boolean} true if the entity is targetable
   */
  isTargetable() {
    return !this.isHibernated();
  }

  /**
   * Returns wether the entity can be targeted by the given entity
   * @param {object} entity - Entity
   * @return {boolean} true if the entity is targetable
   */
  isTargetableByEntity(entity) {
    if (!this.isTargetable()) return false;

    // check whether the given entity can attack fighters
    if (this.getDataObject().isFighter()) {
      const hasCAF = entity.getWeaponManager().hasCAF();
      if (!hasCAF) return false;
    }

    return true;
  }

  /**
   * Returns whether the entity is active or not
   * @return {boolean}
   */
  isHibernated() {
    return this.hibarnated || this._willBeRemoved;
  }

  /**
   * Returns wether the entity can take fighters in
   * @return {boolean}
   */
  isDockable() {
    if (this.dockable === undefined) {
      this.dockable = this.dataObject.getMaxHangar() > 0;
    }
    return this.dockable;
  }

  /**
   * Returns whether the entity is idling or not
   * @return {boolean}
   */
  isIdling() {
    return this.activityManager.isIdling();
  }

  /**
   * Returns whether the entity is executing the Attack activity
   * @return {boolean}
   */
  isAttacking() {
    return this.activityManager.isAttacking();
  }

  /**
   * Returns whether the entity is executing the Produce activity
   * @return {boolean}
   */
  isProducing() {
    if (!this.productionManager) return false;
    return this.productionManager.isProducing();
  }

  /**
   * Returns if there is an obstacle ahead
   * @param {boolean}
   */
  isObstacleAhead() {
    return this.obstacleAhead;
  }

  /**
   * Returns if the entity can be mined
   * @param {boolean}
   */
  isMinable() {
    return (
      this.dataObject.isSpaceObject() &&
      (this.dataObject.getCargoTitanium() ||
        this.dataObject.getCargoSilicium() ||
        this.dataObject.getCargoUranium())
    );
  }

  /**
   * Returns true if the entity is using target firing
   * @return {boolean}
   */
  isTargetFiring() {
    return this.targetFiring;
  }

  /**
   * Wrapper around the local MotionManager.isMoving function. It returns
   * true if the entity is in motion (velocity > 0)
   * @return {boolean}
   */
  isMoving() {
    return this.motionManager.isMoving();
  }

  /**
   * Returns wether the entity can dock
   * @return {boolean}
   */
  canDock() {
    if (this.isAbleToDock === undefined) {
      this.isAbleToDock = this.dataObject.isFighter();
    }
    return this.isAbleToDock;
  }

  /**
   * Returns whether the entity can move or not
   * @return {boolean}
   */
  canMove() {
    return this.dataObject.getSpeed() > 0;
  }

  /**
   * Returns whether the given entity can carry or has cargo
   * @paran {object} entity - Entity instance
   * @return {boolean}
   */
  canCarryCargo() {
    return (
      this.dataObject.getCargoCapacity() ||
      this.dataObject.getCargoTitanium() ||
      this.dataObject.getCargoSilicium() ||
      this.dataObject.getCargoUranium()
    );
  }

  /**
   * Returns true if the entity (e.g.: Mining Station) has a
   * deliverer attached (such as Icarus)
   * @return {boolean}
   */
  hasDeliverer() {
    return this.deliverer;
  }

  /**
   * Returns true if it cannot be managed by the user
   * (e.g.: Federation Icarus)
   * @return {boolean}
   */
  hasNoUserControl() {
    return this.noUserControl;
  }

  /**
   * Returns true if it cannot be managed by the user
   * (e.g.: Federation Icarus)
   * @return {boolean}
   */
  canMine() {
    const weaponsThatCanMine = [
      10, // mining-laser
    ];
    return weaponsThatCanMine.some(id => this.weaponManager.hasWeapon(id));
  }

  /**
   * Returns the entity that is designated as home station
   * (e.g.: Icarus's home station is a Mining Station)
   * @return {object} Entity
   */
  getHomeStation() {
    return this.homeStation;
  }

  /**
   * Returns the sprite object of this entity
   * @return {object} Phaser.Sprite
   */
  getSprite() {
    return this.sprite;
  }

  /**
   * Returns the DataObject instance linked to this entity
   * @return {object} DataObject
   */
  getDataObject() {
    return this.dataObject;
  }

  /**
   * Returns the ActivityManager instance linked to this entity
   * @return {object} ActivityManager
   */
  getActivityManager() {
    return this.activityManager;
  }

  /**
   * Returns the MotionManager instance linked to this entity
   * @return {object} MotionManager
   */
  getMotionManager() {
    return this.motionManager;
  }

  /**
   * Returns the AbilityManager instance linked to this entity
   * @return {object} AbilityManager
   */
  getAbilityManager() {
    return this.abilityManager;
  }

  /**
   * Returns the WeaponManager instance linked to this entity
   * @return {object} WeaponManager
   */
  getWeaponManager() {
    return this.weaponManager;
  }

  /**
   * Returns the ProductionManager instance linked to this entity
   * @return {object} ProductionManager
   */
  getProductionManager() {
    return this.productionManager;
  }

  /**
   * Returns the Player instance to which this entity belongs
   * @return {object} Player
   */
  getPlayer() {
    return this.player;
  }

  /**
   * Returns the team of the Player that owns this entity
   * @return {number}
   */
  getTeam() {
    return this.player.getTeam();
  }

  /**
   * Returns the unique identifier for this entity
   * @return {string}
   */
  getGUID() {
    return this.guid;
  }

  /**
   * Returns the animation manager instance
   * @return {object}
   */
  getAnimationManager() {
    return this.sprite.animations;
  }

  /**
   * Returns the animation manifest instance by the given key
   * @return {object}
   */
  getAnimationByKey(key) {
    const animations = this.getAnimations();
    if (!animations) {
      return null;
    }
    return animations.getAnimation(key);
  }

  /**
   * Returns the collision tile the entity occupies
   * @return {object} array of coordinates [x, y]
   */
  getTile() {
    if (this.suggestedTile) {
      const { x, y } = this.suggestedTile;
      return [x, y];
    }
    const sprite = this.getSprite();
    const x = Math.floor(sprite.x / Const.TILE_WIDTH);
    const y = Math.floor(sprite.y / Const.TILE_WIDTH);
    return [x, y];
  }

  /**
   * Returns the collision tile the entity occupies
   * @return {object} - { x, y }
   */
  getTileObj() {
    if (this.suggestedTile) {
      return this.suggestedTile;
    }
    const sprite = this.getSprite();
    return {
      x: Math.floor(sprite.x / Const.TILE_WIDTH),
      y: Math.floor(sprite.y / Const.TILE_WIDTH),
    };
  }

  /**
   * Returns the arc of collision tiles ahead of the entity based
   * on its rotation (defaults to 3 tiles in predefined concave)
   * @return {object} array of coordinates { x, y }
   */
  getTilesAhead() {
    // normally we use the next tile determined by EasyStarJs
    const nextTile = this.motionManager.getNextTileToTarget();
    if (nextTile) {
      return [nextTile];
    }

    const [x, y] = this.getTile();
    const { width, offsetX, offsetY } = this.sprite._collision;
    const angleCode = this.motionManager.getCurrentAngleCode();
    const maxAngleCode = this.motionManager.getMaxAngleCount();
    const consolidatedAngleCode = Math.floor(angleCode / (maxAngleCode / 8));
    const masks = CollisionMapMasks.getMaskByWidth(width);
    const mask = masks[consolidatedAngleCode];
    const tilesAhead = [];

    if (!mask) return [];

    for (let i = mask.length - 1; i >= 0; i -= 1) {
      for (let j = mask[i].length - 1; j >= 0; j -= 1) {
        if (mask[i][j]) {
          tilesAhead.push({
            x: x - 1 - offsetX + j,
            y: y - 1 - offsetY + i,
          });
        }
      }
    }

    return tilesAhead;
  }

  /**
   * Returns an array of tile coordinates
   * @return {object} array of tile coordinates that leads to the
   * target destination with no collision involved
   */
  getTilesToTarget() {
    return this.motionManager.getTilesToTarget();
  }

  /**
   * Returns an array of entity instances that have been kept by this
   * very entity.
   * @return {object} array of entities that have been docked into this
   */
  getDockedEntities() {
    return this.docker;
  }

  /**
   * Returns the number of docked entities
   * @return {number}
   */
  getNumberOfDockedEntities() {
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
   * @return {array} Entity[]
   */
  getClosestAllyEntitiesInRange() {
    return this.closestAllyEntities || [];
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

  /**
   * Returns helper variables to calculate tiles on the collision map
   * that the entity occupies
   * @return {object} - { width, height, offsetX, offsetY }
   */
  getCollisionData() {
    return this.sprite._collision;
  }
}

export default Entity;
