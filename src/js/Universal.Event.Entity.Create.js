define('Universal.Event.Entity.Create', [
    'Universal.Event',
    'Graphics'
], function(Event, Graphics) {

    var ns = window.fivenations;

    function UniversalEventEntityCreate() {
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityCreate.prototype = Object.create(Event.prototype);
    UniversalEventEntityCreate.prototype.constructor = UniversalEventEntityCreate;

    /**
     * No-op function to be overwritten in the child objects
     * @param {object} [options] [extendable object that presents event details]
     * @return {void}
     */
    UniversalEventEntityCreate.prototype.execute = function(options) {
        var config,
            phaserGame;

        if (!options.data) {
            return;
        }

        config = options.data;
        phaserGame = ns.game;

        if (!config) {
            throw 'Invalid configuration object passed as a parameter!';
        }

        if (Object.keys(ns.entities).indexOf(config.id) === -1) {
            throw 'The requrested entity is not registered!';
        }

        var entity,

            team = config.team || 1,

            // sprite Ids are consisted of the sprite name and the colour id
            spriteId = [config.id, team].join('-'),

            // instanciating a Phaser.Game.Sprite objet for the entity
            sprite = phaserGame.add.sprite(0, 0, spriteId),

            // fomring the DataObject instance from the preloaded JSON file
            dataObject = new DataObject(phaserGame.cache.getJSON(config.id)),

            // rendering group name
            groupName = dataObject.isBuilding() ? 'entities-buildings' : 'entities',

            // choosing the group for entities so that other elements will be obscured by them
            // it's kind of applying zIndex on entities
            group = Graphics.getInstance().getGroup(groupName);

        // passing the team Id from the config param object
        dataObject.setTeam(team);

        // adding the freshly created entity to the main array
        entity = new Entity({
            guid: config.guid,
            entityManager: this,
            sprite: sprite,
            dataObject: dataObject
        }));

    // setting the coordinates if not ommitted 
    if (config.x || config.y) {
        sprite.x = config.x || 0;
        sprite.y = config.y || 0;
    }

    group.add(sprite);
    ns.game.entityManager.add(entity);

};

return UniversalEventEntityCreate;

});