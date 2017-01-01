define('EntityManager', [
    'Graphics',
    'Entity',
    'DataObject',
    'Universal.EventBus',
    'Util'
], function(Graphics, Entity, DataObject, EventBus, Util) {

    var ns = window.fivenations,

        phaserGame,
        singleton,

        // Array for storing all the entities generated 
        entities = [],


        // Entities Event API
        EventAPI = (function(entities) {

            /**
             * creates an immediate object that exposes the event API
             * for entiteis 
             * @param  {array} entities [Array of Entity instances]
             * @return {object} event API calls
             */
            function eventAPI(entities) {

                return {
                    /**
                     * Make all the given entities to move to the given coordinates 
                     * @param  {object} options [configuration object to create the desired event]
                     * @return {this}
                     * @chainable
                     */
                    move: function(options) {

                        var entityNumber = entities.length,
                            rnd = entityNumber === 1 ? 0 : (entityNumber * 4),
                            data = (function() {
                                var data = [];
                                for (var i = entityNumber - 1; i >= 0; i -= 1) {
                                    data.push({
                                        x: options.x - rnd / 2 + Util.rnd(0, rnd),
                                        y: options.y - rnd / 2 + Util.rnd(0, rnd)
                                    });
                                }
                                return data;
                            })();

                        EventBus.getInstance().add({
                            id: 'entity/move',
                            targets: entities,
                            data: data
                        });

                        return this;
                    },
                    /**
                     * Makes all the given entities to patrol between the current and given coordinates 
                     * @param  {object} options [configuration object to create the desired event]
                     * @return {void}
                     * @chainable
                     */
                    patrol: function(options) {

                        EventBus.getInstance().add({
                            id: 'entity/patrol',
                            targets: entities,
                            data: options
                        });

                        return this;
                    },
                    /**
                     * Makes all given entities to perform a stop action
                     * @return {void}
                     * @chainable
                     */
                    stop: function() {

                        EventBus.getInstance().add({
                            id: 'entity/stop',
                            targets: entities
                        });

                        return this;
                    },
                    /**
                     * Removes entities from the game
                     * @return {void}
                     * @chainable
                     */
                    remove: function() {

                        EventBus.getInstance().add({
                            id: 'entity/remove',
                            targets: entities
                        });

                        return this;

                    },
                    /**
                     * Removes all registered activities from the entity's
                     * entity manager instance
                     * @return {void}
                     * @chainable
                     */
                    reset: function() {

                        EventBus.getInstance().add({
                            id: 'entity/reset',
                            targets: entities
                        });

                        return this;
                    },
                    /**
                     * Executes the attached logic for firing the given weapons
                     * @return {void}
                     * @chainable
                     */
                    fire: function(options) {

                        var targetEntity = options.targetEntity.getID();
                        var weaponIndexes = [];

                        entities.forEach(function(entity) {
                            weaponIndexes[entity.getId()] = entity.getWeaponManager().getWeaponsCanFireEntity();
                        });

                        EventBus.getInstance().add({
                            id: 'entity/fire',
                            targets: entities,
                            weaponIndexes: weaponIndexes,
                            targetEntity: targetEntity
                        });

                        return this;
                    },
                    /**
                     * Directly returns the private collection of entities 
                     * @return {array} Array of entity instances 
                     * @chainable
                     */
                    raw: function() {
                        return entities || [];
                    },

                    /**
                     * Directly returns the first element of the private collection
                     * it is particularly handy when the targets have been filtered
                     * to only one entity already 
                     * @return {object} Entity instance
                     */
                    single: function() {
                        return entities[0];
                    },

                    /**
                     * Number of instances in the private collection
                     * @type {integer}
                     */
                    length: entities.length
                }
            };

            /**
             * Creates the eventAPI wrapping the given entities
             * @param  {array} entities [Array of Entity instances]
             * @return {object} event API calls          
             */
            function selector(entities) {
                if (!entities) throw 'Invalid entities array passed!';
                entities = [].concat.call(entities);
                return eventAPI(entities);
            }

            /**
             * returns array of entities with the exposing the activity API against them
             * @param  {mixed} filter [callback to filter entities | Array of Entities | Entity]
             * @return {array} [Array of entities]
             */
            function $(filter) {
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
                    }

                } else if (typeof filter === 'object') {
                    targets = filter;
                } else {
                    targets = entities;
                }
                return selector(targets);
            }

            /**
             * Emits an entity/create event 
             * @param {[type]} config [description]
             */
            $.add = function(config) {
                if (!config) return;
                if (!config.guid) config.guid = Util.getGUID();
                EventBus.getInstance().add({
                    id: 'entity/create',
                    data: config
                });
            }

            return $;

        })(entities);


    function EntityManager() {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }
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
            });

            // setting the coordinates if not ommitted 
            if (config.x || config.y) {
                sprite.x = config.x || 0;
                sprite.y = config.y || 0;
            }

            group.add(sprite);

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
        entities: EventAPI,

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