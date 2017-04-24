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

var SLOW_MANOUVERABAILITY_TRESHOLD = 25;
var MAX_SELECTABLE_UNITS = 22;
var ANIMATION_IDLE_FOREVER = 'idle-forever';

var ns = window.fivenations;

/**
 * Initialising the Phaser.Sprite object with all the additional child elements 
 * such as selector and property bars 
 * @param {[object]} [entity] [Entity object that owns the [sprite] Phaser.Sprite instance]
 * @param {[object]} [sprite] Phaser.Sprite object to which the extended properties and child elements will be linked
 * @param {[object]} [dataObject] [DataObject instance containing all the informations about the entity being instantiated]
 * @return {[object]} 
 */
var extendSprite = function(entity, sprite, dataObject) {

    var origWidth = dataObject.getWidth();
    var origHeight = dataObject.getHeight();

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
    sprite.hitArea = new Phaser.Rectangle(origWidth / -2, origHeight / -2, origWidth, origHeight);
    sprite.body.setSize(origWidth, origHeight, sprite.width / 2 - origWidth / 2, sprite.height / 2 - origHeight / 2);

    sprite._parent = entity;

    return sprite;
};

/**
 * Registers animations sequences against the given sprite object if there is any specified in the DO 
 * @param  {object} sprite [Phaser.Sprite object to get extended with animations]
 * @param  {object} dataObject [DataObject instance that may contain animation sequences defined]
 * @return {void}
 */
var extendSpriteWithAnimations = function(sprite, dataObject){
    var animations = dataObject.getAnimations();
    if (!animations || typeof animations !== 'object') return;
    Object.keys(animations).forEach(function(key){
        var data = animations[key];
        if (data.length) {
            data.forEach(function(animationData, idx){
                sprite.animations.add(key + idx, animationData.frames, animationData.rate, animationData.loopable);        
            });
        } else {
            sprite.animations.add(key, data.frames, data.rate, data.loopable);
        }
        // if there is an animation called `idle-forever` it is played straight away
        if (key === ANIMATION_IDLE_FOREVER) {
            sprite.animations.play(key);
        }
    });
};

/**
 * Extending the given sprite with event listeners
 * @param {[object]} [entity] [Entity object that owns the [sprite] Phaser.Sprite instance]
 * @param {[object]} sprite Phaser.Sprite object to which the extended properties and child elements will be linked
 * @param {[object]} [dataObject] [DataObject instance containing all the informations about the entity being instantiated]
 * @return {[object]} 
 */
var extendSpriteWithEventListeners = function(entity, sprite, dataObject) {
    // input events registered on the sprite object
    sprite.events.onInputDown.add(function() {
        var now;
        var game = this.game;

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
                this.entityManager.entities().filter(function(entity) {
                    // If the entity is off screen we need to exclude
                    if (!Util.between(entity.getSprite().x - game.camera.x, 0, ns.window.width)) {
                        return false;
                    }
                    if (!Util.between(entity.getSprite().y - game.camera.y, 0, ns.window.height)) {
                        return false;
                    }
                    // we need to include only the indentical entities                           
                    return entity.getDataObject().getId() === dataObject.getId();
                }).forEach(function(entity) {
                    entity.select();
                });
            }

            // this needs to be attached to the individual sprite instance
            this.lastClickTime = now;
        }
    }, entity);

    sprite.events.onInputOut.add(function() {
        sprite.hover = false;
    }, this);

    sprite.events.onInputOver.add(function() {
        sprite.hover = true;
    }, this);
};


/**
 * Constructor function for Entity 
 * @param {object} config [configuration object]
 * @example 
 * new Entity({
 *     id:              [unique GUID for the entity]
 *     entityManager:   [Instance of the EntityManager]
 *     sprite:          [preinitialised Phaser.Sprite]
 *     dataObject:      [A instance of DataObject]
 * });
 */
function Entity(config) {

    const gui = GUI.getInstance();

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
    this.energyShield = gui.addEnergyShield(this);

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
    this.colorIndicator = gui.addColorIndicator(this);

}

Entity.prototype = {

    /**
     * registering custom callbacks to the passed events
     * @param  {string}   event    
     * @param  {Function} callback 
     * @return {void}            
     */
    on: function(event, callback) {
        this.eventDispatcher.addEventListener(event, callback);
    },

    /**
     * removing custom callbacks to the passed events
     * @param  {string}   event    
     * @param  {Function} callback 
     * @return {void}            
     */  
    off: function(event, callback) {
        this.eventDispatcher.removeEventListener(event, callback);
    },

    /**
     * Rendering the entity
     * @return {void} 
     */
    update: function(authoritative) {

        this.activityManager.update();
        this.motionManager.update();
        this.weaponManager.update(authoritative);

    },

    /**
     * Altering the entity's position 
     * @param  {[integer]} targetX [description]
     * @param  {[integer]} targetY [description]
     * @return {[void]}
     */
    moveTo: function(targetX, targetY) {
        var move = new ActivityManager.Move(this);
        move.setCoords({x: targetX, y: targetY});
        this.activityManager.add(move);
    },

    /**
     * adds the Stop activity to the activity buffer 
     * @return {void}
     */
    stop: function() {
        var stop = new ActivityManager.Stop(this);
        this.activityManager.add(stop);
        this.eventDispatcher.dispatch('stop', this);
    },

    /**
     * Register the Patrol activity in the entity's ActivityManager instance
     * with the given parameters 
     * @param  {integer} x [horizontal constituent of the coordinate between which the entity patrols]
     * @param  {integer} y [vertical constituent of the coordinate between which the entity patrols]
     * @return {void}
     */
    patrol: function(x, y) {
        var patrol = new ActivityManager.Patrol(this);
        patrol.setStartPoint(this.sprite.x, this.sprite.y);
        patrol.setDestionation(x, y);
        this.activityManager.add(patrol);
    },

    /**
     * Register the Follow activity inthe entity's ActivityManager instance
     * @param  {object} targetEntity [Entity] 
     * @return {void}
     */
    follow: function(targetEntity) {
        var follow = new ActivityManager.Follow(this);
        follow.setTarget(targetEntity);
        this.activityManager.add(follow);
    },

    /**
     * Registers a Fire activity with the given entity set as target
     * @param  {object} targetEntity [Entity] 
     * @return {void}
     */
    fire: function(targetEntity, weapons) {
        var fire = new ActivityManager.Fire(this);
        fire.setTarget(targetEntity);
        fire.setWeapons(weapons);
        this.activityManager.add(fire);
    },

    /**
     * Registers a GetInRange activity with the given entity set as target
     * @param  {object} targetEntity [Entity] 
     * @return {void}
     */
    getInRange: function(targetEntity) {
        var getInRange = new ActivityManager.GetInRange(this);
        getInRange.setTarget(targetEntity);
        this.activityManager.add(getInRange);
    },

    /**
     * Registers a GetToDock activity with the given entity set as target
     * @param  {object} targetEntity [Entity] 
     * @return {void}
     */
    getToDock: function(targetEntity) {
        var getToDock = new ActivityManager.GetToDock(this);
        getToDock.setTarget(targetEntity);
        this.activityManager.add(getToDock);
    },        

    /**
     * Registers a Attack activity with the given entity set as target
     * @param  {object} targetEntity [Entity] 
     * @return {void}
     */
    attack: function(targetEntity) {
        var attack = new ActivityManager.Attack(this);
        attack.setTarget(targetEntity);
        this.activityManager.add(attack);
        this.weaponManager.setTargetEntity(targetEntity);
    },

    /**
     * Registers a RotateToTarget activity with the given entity set as target
     * @param  {object} targetEntity [Entity] 
     * @return {void}
     */
    rotateToTarget: function(targetEntity) {
        var rotate = new ActivityManager.RotateToTarget(this);
        rotate.setTarget(targetEntity);
        this.activityManager.add(rotate);
    },

    /**
     * Adds the given entity to the container for docked entities 
     * @param {object} targetEntity [Entity]
     * @return {void}
     */
    dockTarget: function(targetEntity) {
        targetEntity.hibernate();
        if (this.docker === undefined) {
            this.docker = [];
        }
        targetEntity.unselect();
        this.docker.push(targetEntity);
    },

    /**
     * Reactivates all the entities that have been enclosed into the docker array
     * @return {void}
     */
    undock: function() {
        if (this.docker === undefined) return;

        var entitiesToRelease = [];

        this.docker.forEach(function(entity) {
            entity.reactivate();
            entitiesToRelease.push(entity);
        });
        this.docker = [];

        return entitiesToRelease;
    },

    /**
     * Alters entity attributes according to the given parameters
     * @param {object} params 
     */
    damage: function(params) {
        this.dataObject.damage(params);

        if (this.dataObject.getHull() <= 0) {
            this.entityManager.remove(this);
        } else {
            this.eventDispatcher.dispatch('damage');
        }
    },

    /**
     * Removes all activity from the ActivityManager instance
     * @return {void}
     */
    reset: function() {
        this.activityManager.removeAll();
        this.weaponManager.clearTargetEntity();
    },

    /**
     * Removes entity from gameplay
     * @return {void}
     */
    remove: function() {
        this.sprite._group.remove(this.sprite);
        this.sprite.destroy();
        this.eventDispatcher.dispatch('remove');
        EffectManager.getInstance().explode(this);
    },

    /**
     * Makes the entity unavailable for further actions including 
     * rendering it into the gameplay without removing it completely. This is
     * usually used to actions such as docking into another entity.
     */
    hibernate: function() {
        this.sprite.visible = false;
        this.hibarnated = true;
        this.eventDispatcher.dispatch('hibarnate');
    },

    /**
     * Makes the entity unavailable for further actions including 
     * rendering it into the gameplay without removing it completely. This is
     * usually used to actions such as docking into another entity.
     */
    reactivate: function() {
        this.sprite.visible = true;
        this.hibarnated = false;
        this.eventDispatcher.dispatch('reactivated');
    },

    /**
     * Sets the given animation to be played through the 
     * animation manager Phaser exposes
     * @param {string} key identifier of the animation to be played
     * @return {void}
     */
    animate: function(key) {
        var angleCode = this.motionManager.getCurrentAngleCode();
        var keyWithAngleCode = key + angleCode;
        var animationKey;
        if (this.sprite.animations.getAnimation(keyWithAngleCode)) {
            animationKey = keyWithAngleCode;
        } else if (this.sprite.animations.getAnimation(key)) {
            animationKey = key;
        }
        if (animationKey) {
            this.sprite.animations.play(animationKey);
        }
    },

    /**
     * Stops current animations from being played and reset the frame counter
     * @return {void}
     */
    stopAnimation: function() {
        this.sprite.animations.stop(null, true);
    },

    /**
     * Selects entity
     * @return {void}
     */
    select: function() {
        if (this.isHibernated()) return;

        if (this.entityManager.entities(':selected').length < MAX_SELECTABLE_UNITS) {
            this.selected = true;
            this.eventDispatcher.dispatch('select');
            EventEmitter.getInstance().local.dispatch('gui/selection/change');
        }
    },


    /**
     * Selects the entity as a target of another entity
     * @return {void}
     */
    selectedAsTarget: function() {
        this.eventDispatcher.dispatch('selectedAsTarget');
    },

    /**
     * Unselects entity
     * @return {void}
     */
    unselect: function() {
        this.selected = false;
        this.eventDispatcher.dispatch('unselect');
        EventEmitter.getInstance().local.dispatch('gui/selection/change');
    },

    /**
     * Start a constant floating animation
     * @return {void}
     */
    levitate: function() {
        this.motionManager.levitate();
    },

    /**
     * Stops the floating animation
     */
    stopLevitating: function() {
        this.motionManager.stopLevitating();
    },

    /**
     * Sets the given entity as the closest hostile entity in attack range of this entity
     * @param {object} entity Closest entity that is in a hostile relation with the one initiated the call
     * return {object} Entity
     */
    setClosestHostileEntityInRange: function(entity) {
        this.closestHostileEntity = entity;
    },

    /**
     * Sets the given entity as the closest ally entity in attack range of this entity
     * @param {object} entity Closest entity that is an ally of the one initiated the call
     * return {object} Entity
     */
    setClosestAllyEntityInRange: function(entity) {
        this.closestAllyEntity = entity;
    },        

    hasSlowManeuverability: function() {
        return this.getDataObject().getManeuverability() < SLOW_MANOUVERABAILITY_TRESHOLD;
    },

    isSelected: function() {
        return !!this.selected;
    },

    isHover: function() {
        return this.sprite.hover;
    },

    isInside: function(obj) {
        if (this.sprite.x + this.getDataObject().getWidth() / 2 < obj.x) {
            return false;
        }
        if (this.sprite.x - this.getDataObject().getWidth() / 2 > obj.x + obj.width) {
            return false;
        }
        if (this.sprite.y + this.getDataObject().getHeight() / 2 < obj.y) {
            return false;
        }
        if (this.sprite.y - this.getDataObject().getHeight() / 2 > obj.y + obj.height) {
            return false;
        }
        return true;
    },

    /**
     * returns true if the entity is controlled by the current user
     * @return {Boolean}
     */
    isEntityControlledByUser: function(player) {
        var p = player || PlayerManager.getInstance().getUser();
        if (!p) return false;
        return this.getDataObject().getTeam() === p.getTeam();
    },

    /**
     * Returns whether the given entity is hostile or not
     * @param  {object} entity Entity instance
     * @return {Boolean} true if the given entity is hostile
     */
    isEnemy: function(entity) {
        var playerManager = PlayerManager.getInstance();
        var thisPlayer = this.getPlayer();
        var thatPlayer = entity.getPlayer();
        if (thisPlayer === thatPlayer) return false;
        return playerManager.isPlayerHostileToPlayer(thisPlayer, thatPlayer);
    },

    /**
     * Returns wether the entity can be a target of other entities
     * @return {Boolean} true if the entity is targetable
     */
    isTargetable: function() {
        return !this.isHibernated();
    },

    /**
     * Returns whether the entity is active or not
     * @return {Boolean}
     */
    isHibernated: function() {
        return !!this.hibarnated;
    },

    /**
     * Returns wether the entity can take fighters in
     * @return {Boolean}
     */
    isDockable: function() {
        if (this.dockable === undefined) {
            this.dockable = this.weaponManager.hasWeapon(WeaponManager.WEAPON_DOCK);
        }
        return this.dockable;
    },

    /**
     * Returns wether the entity can dock
     * @return {Boolean}
     */
    canDock: function() {
        if (this.isAbleToDock === undefined) {
            this.isAbleToDock = this.dataObject.isFighter();
        }
        return this.isAbleToDock;
    },

    getSprite: function() {
        return this.sprite;
    },

    getDataObject: function() {
        return this.dataObject;
    },

    getActivityManager: function() {
        return this.activityManager;
    },

    getMotionManager: function() {
        return this.motionManager;
    },

    getAbilityManager: function() {
        return this.abilityManager;
    },

    getWeaponManager: function() {
        return this.weaponManager;
    },

    getPlayer: function() {
        return this.player;
    },

    getGUID: function() {
        return this.guid;
    },

    getAnimationManager: function() {
        return this.sprite.animations;
    },

    getAnimationByKey: function(key) {
        var animations = this.getAnimations();
        if (!animations){
            return null;
        }
        return animations.getAnimation(key);
    },

    getTile: function(map) {
        if (!map) throw 'Invalid Map obect was given!';
        var sprite = this.getSprite(),
            x = Math.floor(sprite.x / map.getTileWidth()),
            y = Math.floor(sprite.y / map.getTileHeight());
        return [x, y];
    },

    /**
     * Returns the closest entity that is in hostile relation to the one triggered the function call
     * @return {object} entity
     */
    getClosestHostileEntityInRange: function() {
        return this.closestHostileEntity;
    },

    getClosestAllyEntityInRange: function() {
        return this.closestAllyEntity;
    }

};

export default Entity;
