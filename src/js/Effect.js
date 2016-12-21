define('Effect', ['Util'], function(Util) {

    var DEFAULT_ANIM_NAME = 'idle';

    /**
     * Registers the EffectManager instance
     * @param {config} config Configuration object that contains the reference to the manager instance
     */
    function setManager(config) {
        this.manager = config.manager;
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
            if (key === DEFAULT_ANIM_NAME) {
                this.sprite.animations.play(key);
            }
        }.bind(this));
    }

    /**
     * Registers a listener to the remove Event
     */
    function registerRemoveEventToAnimation(effect, animation) {
        animation.killOnComplete = true;
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
        setManager.call(this, config);    
        setSprite.call(this, config); 
        setAnimations.call(this, config);
        setTTL.call(this, config);       
    }

    Effect.prototype = {

        getId: function() {
            return this.id;
        },

        getSprite: function() {
            return this.sprite;
        },

        remove: function() {
            this.manager.remove(this);
        }

    }

    return Effect;

});