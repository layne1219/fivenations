define('EffectManager', [
    'Graphics',
    'Effect',
    'DataObject',
    'Util'
], function(Graphics, Effect, DataObject, Util) {

    var ns = window.fivenations;

    var phaserGame;
    var singleton;

    var effects = [];

    function EffectManager() {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }
    }

    EffectManager.prototype = {

        /**
         * Adds an effect object to the private collection
         * @param {object} config configuration object
         */
        add: function(config) {

            if (!config) {
                throw 'Invalid configuration object passed as a parameter!';
            }

            if (Object.keys(ns.effects).indexOf(config.id) === -1) {
                throw 'The requrested effect is not registered!';
            }

            var effect;
            var sprite = phaserGame.add.sprite(0, 0, config.id);
            var dataObject = new DataObject(phaserGame.cache.getJSON(config.id));

            // adding the freshly created effect to the main array
            var effect = new Effect({
                manager: this,
                sprite: sprite,
                dataObject: dataObject
            });

            // setting the coordinates if not ommitted 
            if (config.x || config.y) {
                sprite.x = config.x || 0;
                sprite.y = config.y || 0;
            }

            // setting up velocity 
            if (config.velocity) {
                // actiavting the ARCADE physics on the sprite object
                phaserGame.physics.enable(sprite, Phaser.Physics.ARCADE);                
                sprite.body.velocity.set(config.velocity.x, config.velocity.y);
            }

            var group = Graphics.getInstance().getGroup('effects');
            group.add(sprite);

            effects.push(effect);
        },

        explode: function(entity) {
            if (!entity) return;

            var eventData = entity.dataObject.getEvent('remove');
            var effectId;
            var sprite;
            var minWrecks;
            var maxWrecks;
            var i;

            if (eventData) {

                sprite = entity.getSprite();

                if (eventData.effects && eventData.effects.length) {
                    eventData.effects.forEach(function(effectId) {
                        this.add({
                            id: effectId,
                            x: sprite.x,
                            y: sprite.y
                        });
                    }.bind(this));
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

        },

        /**
         * Removes effect from the private collection
         * @param {object} effect Effect instance
         */
        remove: function(effect) {
            for (var i = effects.length - 1; i >= 0; i -= 1) {
                if (effect === effects[i]) {
                    effects.splice(i, 1);
                }
            }
            effect = null;
        },

        /**
         * Removes effect with the given index from the private collection
         * @param {integer} idx index of the effect in the effect queue
         */        
        removeByIndex: function(idx) {
            effects.splice(idx, 1);
        },

        /**
         * destroys all the existing effects
         * @return {void}
         */
        reset: function() {
            effects = [];
        },
        
        /**
         * Update function called on every tick
         * @return {void}
         */
        update: function() {
            for (var i = effects.length - 1; i >= 0; i -= 1) {
                if (!effects[i].ttl) continue;
                effects[i].ttl -= 1;
                if (effects[i].ttl === 0) {
                    this.removeByIndex(i);
                }
            }
        },

        /**
         * returns the Phaser.Game object for inconvinience 
         * @return {[object]} [Phaser.Game instnace]
         */
        getGame: function() {
            return phaserGame;
        }

    };

    return {

        /**
         * sets the global Phaser.Game instance
         * @param {void}
         */
        setGame: function(game) {
            phaserGame = game;
        },

        /**
         * returns singleton instance of the manager object
         * @return {object} Singleton instance of EffectManager
         */
        getInstance: function() {
            if (!phaserGame) {
                throw 'Invoke setGame first to pass the Phaser Game entity!';
            }
            if (!singleton) {
                singleton = new EffectManager();
            }
            return singleton;
        }

    };

});