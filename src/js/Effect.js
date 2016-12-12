define('Effect', function() {

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

        // sets the animations defined in the DO
        extendSpriteWithAnimations(this.sprite, dataObject);

        // coords
        this.sprite.x = 0;
        this.sprite.y = 0;

        // reducing the hitArea according the one specified in the realated DataObject
        this.sprite.hitArea = new Phaser.Rectangle(dataObject.getWidth() / -2, dataObject.getHeight() / -2, dataObject.getWidth(), dataObject.getHeight());

    }

    /**
     * Registers animations sequences against the given sprite object if there is any specified in the DO 
     * @param  {object} sprite [Phaser.Sprite object to get extended with animations]
     * @param  {object} dataObject [DataObject instance that may contain animation sequences defined]
     * @return {void}
     */
    function extendSpriteWithAnimations(sprite, dataObject){
        var animations = dataObject.getAnimations();
        if (!animations || typeof animations !== 'object') return;
        Object.keys(animations).forEach(function(key){
            var data = animations[key];
            sprite.animations.add(key, data.frames, data.rate, data.loopable);
            if (key === 'idle') {
                sprite.animations.play(key);
            }
        });
    }

    /**
     * initialises a Effect instance
     * @param {object} config Configuration object to initialise the effect object
     * @return {object}
     */
    function Effect(config) {       
        setSprite.call(this, config);        
    }

    Effect.prototype = {

        getId: function() {
            return this.id;
        },

        getSprite: function() {
            return this.sprite;
        }

    }

    return Effect;

});