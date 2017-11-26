import Util from '../common/Util';
import Graphics from '../common/Graphics';
import DataObject from '../model/DataObject';
import EventEmitter from '../sync/EventEmitter';
import Effect from './Effect';

const DEFAULT_GRAPHICS_GROUP = 'effects';
const ns = window.fivenations;

let effects = [];
let phaserGame;
let singleton;

class EffectManager {

    constructor() {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }       
    }

    /**
     * Adds an effect object to the private collection
     * @param {object} config configuration object
     */
    add(config) {

        let point;
        let group;
        let groupName;
        let dataSource;

        const sprite = phaserGame.add.sprite(0, 0, config.id);
        
        // fetching the DataObject instance from the preloaded JSON file
        if (window.editor && localStorage && localStorage.getItem(config.id)) {
            dataSource = JSON.parse(localStorage.getItem(config.id));
        } else {
            dataSource = phaserGame.cache.getJSON(config.id);
        }
        const dataObject = new DataObject(dataSource);

        // adding the freshly created effect to the main array
        const effect = new Effect({
            guid: config.guid,
            emitter: config.emitter,
            manager: this,
            sprite: sprite,
            dataObject: dataObject
        });

        // setting the coordinates if not ommitted 
        if (config.x || config.y) {
            sprite.x = config.x || 0;
            sprite.y = config.y || 0;
        }

        // Heading of the effect
        if (config.rotation !== undefined) {
            sprite.rotation = config.rotation;
        } else if (config.angle !== undefined) {
            sprite.angle = config.angle;
        }

        // Activates physics engine if required
        if (config.velocity || config.acceleration) {
            phaserGame.physics.enable(sprite, Phaser.Physics.ARCADE);
        }

        // sets up velocity 
        if (config.velocity) {

            if (config.rotation !== undefined) {
                point = phaserGame.physics.arcade.velocityFromRotation(config.rotation, config.velocity);
            } else if (config.angle !== undefined) {
                point = phaserGame.physics.arcade.velocityFromAngle(config.angle, config.velocity);
            } else if (config.velocity.x || config.velocity.y) {
                point = new Phaser.Point(config.velocity.x || 0, config.velocity.y || 0);
            }

            if (point) {
                sprite.body.velocity = point;
            }

            // saving the original velocity for later use (like effects following targets)
            sprite.body._origVelocity = config.velocity;

        }

        // sets acceleration
        if (config.acceleration) {

            if (config.rotation !== undefined) {
                point = phaserGame.physics.arcade.accelerationFromRotation(config.rotation, config.acceleration);
            } else if (config.angle !== undefined) {
                point = phaserGame.physics.arcade.accelerationFromAngle(config.angle, config.acceleration);
            } else if (config.acceleration.x || config.acceleration.y) {
                point = new Phaser.Point(config.acceleration.x || 0, config.acceleration.y || 0);
            }

            if (point) {
                sprite.body.acceleration = point;
            }

        }

        if (config.maxVelocity) {
            sprite.body.maxVelocity.set(config.maxVelocity);
        }

        // adds sprite to the appropriate graphics group 
        groupName = dataObject.getTargetGraphicsGroup() || DEFAULT_GRAPHICS_GROUP;
        group = Graphics.getInstance().getGroup(groupName);
        sprite._group = group;
        group.add(sprite);

        // triggers registered listener if any
        if (config.callback) {
            config.callback(effect);
        } 

        // executes defined functionality in the data object
        const initEventConfig = dataObject.getEvent('create');

        if (initEventConfig) {

            const effects = initEventConfig.effects || [];

            effects.forEach(effectId => {
                this.add({
                    id: effectId,
                    x: sprite.x,
                    y: sprite.y
                });
            });            

            if (initEventConfig.execute) {
                const exec = initEventConfig.execute;
                const target = exec.target === 'self' ? effect : null; 
                const func = this[exec.command] && this[exec.command].bind(this);

                if (func) func(target); 
            }
        }

        // pushes it to the local effect collection 
        effects.push(effect);
    }

    /**
     * Removes effect from the private collection
     * @param {object} effect Effect instance
     */
    remove(effect) {
        for (var i = effects.length - 1; i >= 0; i -= 1) {
            if (effect === effects[i]) {
                this.removeByIndex(i);
            }
        }
        effect = null;
    }

    /**
     * Removes effect with the given index from the private collection
     * @param {integer} idx index of the effect in the effect queue
     */        
    removeByIndex(idx) {
        if (!effects[idx]) return;
        effects[idx].remove();
        effects.splice(idx, 1);
    }

    /**
     * destroys all the existing effects
     * @return {void}
     */
    reset() {
        effects = [];
    }
    
    /**
     * Update function called on every tick
     * @param {boolean} authoritative Flag to indicate the authoritative client
     * @return {void}
     */
    update(authoritative) {

        for (var i = effects.length - 1; i >= 0; i -= 1) {
            if (authoritative && this.isEffectExpired(effects[i])) {
                EventEmitter.getInstance().synced.effects(effects[i]).remove();
            } else {
                if (effects[i].willFollowTarget()) {
                    this.followTarget(effects[i]);
                }
                if (effects[i].hasTrails()) {
                    this.emitTrails(effects[i]);
                }
            }
        }

    }

    /**
     * Updates ttl attribute of the given effect entity and returns
     * @param {object} effect Effect entity
     * @return {boolean} true if the effect needs to be removed
     */
    isEffectExpired(effect) {
        if (effect.ttl === 0) return true;
        if (effect.ttl > 0) effect.ttl -= 1;                
        return false;
    }

    /**
     * returns the Phaser.Game object for inconvinience 
     * @return {[object]} [Phaser.Game instnace]
     */
    getGame() {
        return phaserGame;
    }

    /**
     * Returns the array of effects or an empty array
     * @param {string} guid 
     * @return {object} effect instance 
     */
    getEffectByGUID(guid) {
        for (var i = effects.length - 1; i >= 0; i -= 1) {
            if (effects[i].getGUID() === guid) {
                return effects[i];
            }
        }
        return null;
    }

    /**
     * Returns an instance of the AnimationManager class
     * @return {object} instancse of AnimationManager class
     */
    getAnimationManager() {
        return this.animationManager;
    }

    /*******************************************************************************
     *                         EFFECT MANIPULATOR FUNCTIONALITIES                  *
     *******************************************************************************/

    /**
     * Triggers an explosion animation configured in the DataObject
     * @param {object} entity Any object possesses DataObject instance
     */
    explode(entity) {
        if (!entity || !entity.getDataObject) return;

        var effectId;
        var sprite;
        var minWrecks;
        var maxWrecks;
        var i;
        var eventData = entity.getDataObject().getEvent('remove');

        if (!eventData) return;

        sprite = entity.getSprite();

        if (eventData.effects && eventData.effects.length) {
            if (eventData.randomize) {
                effectId = eventData.effects[Util.rnd(0, eventData.effects.length - 1)];
                this.add({
                    id: effectId,
                    x: sprite.x,
                    y: sprite.y,
                    emitter: entity
                });
            } else {
                eventData.effects.forEach(effectId => {
                    this.add({
                        id: effectId,
                        x: sprite.x,
                        y: sprite.y,
                        emitter: entity
                    });
                });
            }
        }

        if (eventData.wrecks && eventData.wrecks.length) {
            minWrecks = eventData.minWrecks || 0;
            maxWrecks = eventData.maxWrecks || 0;
            for (i = minWrecks; i <= maxWrecks; i += 1) {
                effectId = eventData.wrecks[Util.rnd(0, eventData.wrecks.length - 1)];
                this.add({
                    id: effectId,
                    x: sprite.x + Util.rnd(0, 30) - 15,
                    y: sprite.y + Util.rnd(0, 30) - 15,
                    velocity: {
                        x: (Math.random() - 0.5) * Util.rnd(75, 100),
                        y: (Math.random() - 0.5) * Util.rnd(75, 100)
                    }
                });                        
            }
        }

    }    

    /**
     * makes the given effect to follow its target if specififed
     * @param  {object} effect Effect entity
     * @return {void}
     */
    followTarget(effect) {
        var targetEntity = effect.getTargetEntity();
        var rotation;
        var sprite;
        var targetSprite;
        var point;
        
        if (!targetEntity) {

            effect.ttl = 0;

        } else {
        
            sprite = effect.getSprite();
            targetSprite = targetEntity.getSprite();

            rotation =  ns.game.game.physics.arcade.angleBetween(sprite, targetSprite);
            point = phaserGame.physics.arcade.velocityFromRotation(rotation, sprite.body._origVelocity, sprite.body.velocity);
            
            sprite.body.velocity = point;
            sprite.rotation = rotation;

        }

    }

    /**
     * emits the effects configured as trail
     * @param  {object} effect Effect entity
     * @return {void}
     */
    emitTrails(effect) {
        if (effect.ttl % effect.getTrailsRate() === 0) {
            this.add({
                id: effect.getTrailsEffect(),
                x: effect.getSprite().x + Util.rnd(0, 10) - 5,
                y: effect.getSprite().y + Util.rnd(0, 10) - 5
            });
        }
    }


    /**
     * makes the effects flash and disappear quickly
     * @param  {object} effect Effect entity
     * @return {void}
     */
    flash(effect) {
        if (!effect) return;

        const sprite = effect.getSprite();
        sprite.alpha = 0;
        
        const flashTween = phaserGame.add.tween(sprite).to({alpha: 1}, 200, Phaser.Easing.Bounce.InOut, true, 0, 0, true);
        flashTween.onComplete.add(function() {
            this.remove(effect);
        }, this);
    }


};

export default {

    /**
     * sets the global Phaser.Game instance
     * @param {void}
     */
    setGame: function(game) {
        phaserGame = game;
    },

    /**
     * returns singleton instance of the manager object
     * @param {boolean} forceNewInstance
     * @return {object} Singleton instance of EffectManager
     */
    getInstance: function(forceNewInstance) {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }
        if (!singleton || forceNewInstance) {
            singleton = new EffectManager();
            singleton.reset();
        }
        return singleton;
    }

};
