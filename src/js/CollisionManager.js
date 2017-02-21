define('CollisionManager', [
    'Graphics', 
    'PlayerManager', 
    'Universal.EventEmitter', 
    'Util'
], function(Graphics, PlayerManager, EventEmitter) {
    
    var phaserGame;
    var singleton;

    /**
     * creates a singleton instance with the given configurations
     * @param  {object} config 
     * @return {objet}
     */
    function createCollisionManager() {
        var entityGroup = Graphics.getInstance().getGroup('entities');
        var entityBuildingGroup = Graphics.getInstance().getGroup('entities-buildings');
        var effectGroup = Graphics.getInstance().getGroup('effects');

        return {

            update: function(authoritative) {

                if (authoritative) {
                    phaserGame.physics.arcade.overlap(effectGroup, entityGroup, collisionHandler);
                    phaserGame.physics.arcade.overlap(effectGroup, entityBuildingGroup, collisionHandler);
                }

            }

        }
    }

    /**
     * Callback to handle collisions between effects and entities
     * @param {object} effectSprite - Phaser.Sprite
     * @param {object} entitySprite - Phaser.Sprite
     */
    function collisionHandler(effectSprite, entitySprite) {
        var entity = entitySprite._parent;
        var effect = effectSprite._parent;
        var weapon = effect.getEmitter();
        var getEmitterEntity; 

        if (!entity || !effect || !weapon) return;

        getEmitterEntity = weapon.getManager().getEntity();

        // effect mainly cannot collide with the entity that initially emitted it
        if (getEmitterEntity === entity) return;

        // effect cannot collide with friendly entities unless the friendly fire is on
        if (!getEmitterEntity.isEnemy(entity) && !weapon.hasFriendlyFire()) return;

        var collisionEvent = effect.getDataObject().getEvent('collision');
        var eventEmitter = EventEmitter.getInstance();

        if (collisionEvent.removeEffect) {
            eventEmitter.synced.effects(effect).remove();
        }

        if (collisionEvent.damageTarget) {
            eventEmitter.synced.entities(entity).damage({ weapon: weapon });
        }

    }   

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
         * @return {object} Singleton instance of EntityManager
         */
        getInstance: function() {
            if (!phaserGame) {
                throw 'Invoke setGame first to pass required Phaser.Game instance!';
            }
            if (!singleton) {
                singleton = createCollisionManager();
            }
            return singleton;
        }

    };

});