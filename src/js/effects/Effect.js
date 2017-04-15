import Util from '../common/Util';

const DEFAULT_ANIM_NAME = 'idle';

/**
 * Sets the unique id
 * @param {object} config
 */
function setGUID(config) {
    this.guid = config.guid;
}

/**
 * Registers the EffectManager instance
 * @param {config} config Configuration object that contains the reference to the manager instance
 */
function setManager(config) {
    this.manager = config.manager;
}

/**
 * Saves the DataObject instance to the object scope
 * @param {config} config Configuration object that contains the reference to the manager instance
 */
function setDataObject(config) {
    this.dataObject = config.dataObject;
}

/**
 * Saves the object reference that invoked the EffectManager to generate this very effect instance
 * @param {config} config Configuration object that contains the reference to the manager instance
 */
function setEmitter(config) {
    if (config.emitter) {
        this.emitter = config.emitter;
        this.targetEntity = this.emitter.getTargetEntity();
        this.targetEntity.on('remove', function() {
            this.targetEntity = null;
        }.bind(this));
    }
}

/**
 * Prepares to sprite to further use
 * @param {object} config Configuration object
 * @return {void} 
 */
function setSprite(config) {

    var game = config.manager.getGame();
    var dataObject= config.dataObject;

    this.sprite = config.sprite;

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    // Set up the Phaser.Sprite object
    this.sprite.anchor.setTo(0.5, 0.5);

    // coords
    this.sprite.x = 0;
    this.sprite.y = 0;

    // reducing the hitArea according the one specified in the realated DataObject
    this.sprite.hitArea = new Phaser.Rectangle(dataObject.getWidth() / -2, dataObject.getHeight() / -2, dataObject.getWidth(), dataObject.getHeight());

    // set frame if the effect has multiple variances
    var variances = dataObject.getVariances();
    if (variances.length) {
        this.sprite.frame = variances[Util.rnd(0, variances.length - 1)];
    }

    // set custom frame if it's configured in the DO
    var customFrame = dataObject.getCustomFrame();
    if (customFrame !== undefined) {
        this.sprite.frame = customFrame;
    }

    this.sprite._parent = this;    

}

/**
 * Registers animations sequences against the given sprite object if there is any specified in the DO 
 * @param  {object} config [configuration object to initialise animations]
 * @return {void}
 */
function setAnimations(config) {
    var dataObject = config.dataObject;
    var animations = dataObject.getAnimations();
    if (!animations || typeof animations !== 'object') return;
    Object.keys(animations).forEach(function(key){
        var data = animations[key];
        var animation;
        animation = this.sprite.animations.add(key, data.frames, data.rate, data.loopable);
        
        if (data.oncomplete === 'remove') {
            registerRemoveEventToAnimation(this, animation);
        }
        
        if (data.oncomplete === 'keepLastFrame') {
            animation.onComplete.add(function() {
                this.sprite.frame = data.frames[data.frames.length - 1];
            }.bind(this));
        }

        if (key === DEFAULT_ANIM_NAME) {
            this.sprite.animations.play(key);
        }
    }.bind(this));
}

/**
 * Registers a listener to the remove Event
 */
function registerRemoveEventToAnimation(effect, animation) {
    animation.onComplete.add(function() {
        effect.remove();
    });
}

function setTTL(config) {
    this.ttl = config.dataObject.getTTL();
}

/**
 * initialises a Effect instance
 * @param {object} config Configuration object to initialise the effect object
 * @return {object}
 */
function Effect(config) {
    setGUID.call(this, config);
    setManager.call(this, config);
    setDataObject.call(this, config);
    setSprite.call(this, config);
    setEmitter.call(this, config); 
    setAnimations.call(this, config);
    setTTL.call(this, config);       
}

Effect.prototype = {

    remove: function() {
        this.sprite._group.remove(this.sprite);
        this.sprite.destroy();
        this.manager.explode(this);
    },

    getId: function() {
        return this.id;
    },

    getGUID: function() {
        return this.guid;
    },

    getSprite: function() {
        return this.sprite;
    },

    getEmitter: function() {
        return this.emitter;
    },

    getTargetEntity: function() {
        return this.targetEntity;
    },

    getDataObject: function() {
        return this.dataObject;
    },

    willFollowTarget: function() {
        return this.dataObject.getFollowTarget();
    },

    hasTrails: function() {
        if (!this.trails) {
            this.trails = this.dataObject.getTrails();
        }
        return !!this.trails;
    },

    getTrailsRate: function() {
        if (!this.trails) {
            this.trails = this.dataObject.getTrails();
        }
        return this.trails.rate;
    },

    getTrailsEffect: function() {
        if (!this.trails) {
            this.trails = this.dataObject.getTrails();
        }
        return this.trails.effect;
    }        

}

export default Effect;
