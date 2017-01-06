define('EntityManager', [
    'Graphics',
    'Entity',
    'DataObject'
], function(Graphics, Entity, DataObject) {

    var GROUP_EFFECTS = 'effects';
    var GROUP_ENTITIES = 'entities';
    var GROUP_ENTITIES_BUILDINGS = 'entities-buildings';

    var ns = window.fivenations;

    var phaserGame;
    var singleton;

    var entities = [];

    function EntityManager() {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }

        this.entityGroup = Graphics.getInstance().getGroup(GROUP_ENTITIES);
        this.entityBuildingGroup = Graphics.getInstance().getGroup(GROUP_ENTITIES_BUILDINGS);       
        this.effectGroup = Graphics.getInstance().getGroup(GROUP_EFFECTS);
    }

    EntityManager.prototype = {

        /**
         * Adds an entity object to the private collection
         * @param {object} config configuration object
         */
        add: function(config) {

            if (!config) {
                throw 'Invalid configuration object passed as a parameter!';
            }

            if (Object.keys(ns.entities).indexOf(config.id) === -1) {
                throw 'The requrested entity is not registered!';
            }

            var entity,

                team = config.team || 1,

                // instanciating a Phaser.Game.Sprite objet for the entity
                sprite = phaserGame.add.sprite(0, 0, config.id),

                // fomring the DataObject instance from the preloaded JSON file
                dataObject = new DataObject(phaserGame.cache.getJSON(config.id)),

                // rendering group name
                groupName = dataObject.isBuilding() ? GROUP_ENTITIES_BUILDINGS : GROUP_ENTITIES,

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
            });

            // setting the coordinates if not ommitted 
            if (config.x || config.y) {
                sprite.x = config.x || 0;
                sprite.y = config.y || 0;
            }

            group.add(sprite);
            sprite._group = group;

            entities.push(entity);
        },

        /**
         * Removes entity from the private collection
         * @param {object} entity Entity instance
         */
        remove: function(entity) {
            for (var i = entities.length - 1; i >= 0; i -= 1) {
                if (entity === entities[i]) {
                    entities.splice(i, 1);
                }
            }
            entity.remove();
            entity = null;
        },

        /**
         * Alters entity attributes 
         * @param {integer} elapsedTime [elpased time since the last registered tick]
         * @return {void}
         */
        update: function(elapsedTime) {
            var steps = Math.ceil(elapsedTime / (1000 / 60));
            while (steps) {
                for (var i = entities.length - 1; i >= 0; i -= 1) {
                    entities[i].update();
                }
                steps -= 1;
            }

            phaserGame.physics.arcade.overlap(this.effectGroup, this.entityGroup, collisionHandler);
            phaserGame.physics.arcade.overlap(this.effectGroup, this.entityBuildingGroup, collisionHandler);
        },

        /**
         * destroys all the existing entities
         * @return {void}
         */
        reset: function() {
            entities = [];
        },

        /**
         * Unselect all entities expect the passed if it is not omitted
         * It can directly employ the private collection of entities since
         * it triggers only client related action
         * @param {object} [entity] [Entity instance that will be excluded from the selection]
         * @return {void} 
         */
        unselectAll: function(excludedEntity) {
            entities.forEach(function(entity) {
                if (excludedEntity !== entity && entity.isSelected()) {
                    entity.unselect();
                }
            });
        },

        /**
         * Exposes EventAPI to all the active entities 
         * @type {object}
         * @see EventAPI
         */
        entities: createSelector(entities),

        /**
         * returns the subsection of the attributes of the given entities
         * @param  {[array]} entities [Array of the given entities]
         * @return {[array]}          [Array of the merged abilities]
         */
        getMergedAbilities: function(entities) {
            var abilities,
                next,
                subsection = function(next){
                    return function(val) {
                        return next.getAbilityManager().getAbilities().indexOf(val) !== -1;
                    };
                }

            if (!entities || !entities.length) {
                return [];
            }

            abilities = entities.shift().getAbilityManager().getAbilities();

            while ((next = entities.shift())) {
                abilities = abilities.filter(subsection(next));
            }

            return abilities;
        },

        /**
         * returns the Phaser.Game object for inconvinience 
         * @return {[object]} [Phaser.Game instnace]
         */
        getGame: function() {
            return phaserGame;
        },

        /**
         * Creates a selector function with the given entities.
         * This selector function can be used to filter down entities through a specified API.
         * @param {entities} Array array of entity instances
         * @return {function}
         */
        getSelector: function(entities) {
            return createSelector(entities);
        }

    };

    /**
     * Callback to handle collisions between effects and entities
     * @param {object} effectSprite - Phaser.Sprite
     * @param {object} entitySprite - Phaser.Sprute
     */
    function collisionHandler(effectSprite, entitySprite) {
        var entity = entitySprite._parent;
        var effect = effectSprite._parent;
        var weapon = effect.getEmitter();

        // effect mainly cannot collide with the entity that initially emitted it
        if (weapon.getManager().getEntity() === entity) return;

        var collisionEvent = effect.getDataObject().getEvent('collision');

        if (collisionEvent.removeEffect) {
            console.log('This must be replaced with Universal.Event');
        }

        if (collisionEvent.damageTarget) {
            var damage = weapon.getDamage();
            var damageShield = weapon.getDamageShield();
            console.log('Entity is damaged by ', damage, damageShield);
        }

    }

    /**
     * Creates a function that can be used to filter entities
     * @param {array} entities Array of entities the can be filtered further
     * @return {function} 
     */
    function createSelector(entities) {
        /**
         * returns array of entities with the exposing the activity API against them
         * @param  {mixed} filter [callback to filter entities | Array of Entities | Entity]
         * @return {array} [Array of entities]
         */
        return function $(filter) {
            var targets;

            if (typeof filter === 'function') {
                targets = entities.filter(filter);
            } else if (typeof filter === 'string') {

                if (filter === ':selected') {
                    targets = entities.filter(function(entity) {
                        return entity.isSelected();
                    });
                } else if (filter === ':user') {
                    targets = entities.filter(function(entity) {
                        return entity.isEntityControlledByUser();
                    });
                } else if (filter === ':user:selected') {
                    targets = entities.filter(function(entity) {
                        return entity.isEntityControlledByUser() && entity.isSelected();
                    });
                } else {
                    targets = entities.filter(function(entity) {
                        return entity.getId() === filter;
                    });
                    return targets[0];
                }

            } else if (typeof filter === 'object') {
                targets = filter;
            } else {
                targets = entities;
            }

            return [].concat.call(targets);
        };

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
                throw 'Invoke setGame first to pass the Phaser Game entity!';
            }
            if (!singleton) {
                singleton = new EntityManager();
            }
            return singleton;
        }

    };

});