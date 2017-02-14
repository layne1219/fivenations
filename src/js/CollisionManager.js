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

        if (!entity || !effect || !weapon) return;

        // effect mainly cannot collide with the entity that initially emitted it
        if (weapon.getManager().getEntity() === entity) return;

        var collisionEvent = effect.getDataObject().getEvent('collision');

        if (collisionEvent.removeEffect) {
            EventEmitter.getInstance().synced.effects(effect).remove();
        }

        if (collisionEvent.damageTarget) {
            var damage = weapon.getDamage();
            var damageShield = weapon.getDamageShield();
            console.log('Entity is damaged by ', damage, damageShield);
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