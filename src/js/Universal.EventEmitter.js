define('Universal.EventEmitter', [
    'Universal.EventBus',
    'Util'
], function(EventBus, Util) {
    var singleton;

    /**
     * Creates an API for generating Universal Events for Entities
     * @param {object} entityManager Instance of EntityManager
     * @return {function}
     */
    function createEntityEventAPI(entityManager) {

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
                        data: data,
                        resetActivityQueue: options.resetActivityQueue
                    });

                    return this;
                },
                /**
                 * Makes all the given entities to follow the given target entity 
                 * @param  {object} options [configuration object to create the desired event]
                 * @return {void}
                 * @chainable
                 */
                follow: function(options) {

                    var targetEntity = options.targetEntity;

                    EventBus.getInstance().add({
                        id: 'entity/follow',
                        targets: entities,
                        data: {
                            targetEntity: targetEntity.getGUID()
                        },
                        resetActivityQueue: options.resetActivityQueue
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
                        data: options,
                        resetActivityQueue: options.resetActivityQueue
                    });

                    return this;
                },
                /**
                 * Makes all given entities to perform a stop action
                 * @return {void}
                 * @chainable
                 */
                stop: function(options) {

                    EventBus.getInstance().add({
                        id: 'entity/stop',
                        targets: entities,
                        resetActivityQueue: options.resetActivityQueue
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

                    var targetEntity = options.targetEntity;
                    var weaponGUIDs = [];
                    var weaponCount = 0;

                    entities.forEach(function(entity, idx) {
                        weaponGUIDs[idx] = entity
                            .getWeaponManager()
                            .getWeaponsCanFireEntity(targetEntity)
                            .map(function(weapon) {
                                weaponCount += 1;
                                return weapon.getGUID();
                            }); 
                    });

                    if (weaponCount) {

                        EventBus.getInstance().add({
                            id: 'entity/fire',
                            targets: entities,
                            data: {
                                weaponGUIDs: weaponGUIDs,
                                targetEntity: targetEntity.getGUID(),
                            },
                            resetActivityQueue: options.resetActivityQueue
                        });

                    }

                    return this;
                },
                /**
                 * Executes the attached logic for attack the given target
                 * @return {void}
                 * @chainable
                 */
                attack: function(options) {

                    var targetEntity = options.targetEntity;

                    EventBus.getInstance().add({
                        id: 'entity/attack',
                        targets: entities,
                        data: {
                            targetEntity: targetEntity.getGUID()
                        },
                        resetActivityQueue: options.resetActivityQueue
                    });

                    return this;
                },
                /**
                 * Inflicts a defined damage to the specify entities
                 * @return {void}
                 * @chainable
                 */
                damage: function(options) {

                    var weapon = options.weapon;

                    EventBus.getInstance().add({
                        id: 'entity/damage',
                        targets: entities,
                        data: {
                            damage: weapon.getDamage(),
                            damageShield: weapon.getDamageShield()
                        }
                    });

                    return this;
                }

            }
        };

        /**
         * returns array of entities with the exposing the activity API against them
         * @param  {mixed} filter [callback to filter entities | Array of Entities | Entity]
         * @return {array} [Array of entities]
         */
        function $(filter) {
            var selector = entityManager.getSelector(entityManager.entities());
            var entities = selector(filter);
            return eventAPI([].concat.call(entities));
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
    };

    /**
     * Creates an API for generating Universal Events for Players
     * @param {object} playerManager Instance of PlayerManager
     * @return {function}
     */
    function createPlayerEventAPI(playerManager) {

        /**
         * Returns an API with the possible emitable events for players
         * @param {array} players Array of players after applying the filtering
         * @return {object} API
         */
        function api(players) {

            return {

                alter: function(config) {

                    players.forEach(function(player) {
                        var data = Object.create(config);
                        data.guid = player.getGUID();
                        EventBus.getInstance().add({
                            id: 'player/resource/alter',
                            data: data
                        });
                    });
                }

            }

        }

        /**
         * returns array of players with the exposing the activity API against them
         * @param  {mixed} filter [callback to filter players | Array of players | Entity]
         * @return {array} [Array of players]
         */
        function $(filter) {
            var targets;
            if (filter === ':user') {
                targets = playerManager.getUser();
            } else if (filter !== undefined) {
                targets = playerManager.getPlayerByGUID(filter);
            } else {
                targets = playerManager.getPlayers();
            }
            return api([].concat.call(targets));
        }

        /**
         * Emits an player/create event 
         * @param {object} config configuration object for the player
         */
        $.add = function(config) {
            if (!config) return;
            if (!config.guid) config.guid = Util.getGUID();
            EventBus.getInstance().add({
                id: 'player/create',
                data: config
            });
        };

        return $;
    }

    /**
     * Creates an API for generating Universal Events for Effects
     * @param {object} effectManager Instance of EffectManager
     * @return {function}
     */
    function createEffectEventAPI(effectManager) {

        /**
         * Returns an API with the possible emitable events for effects
         * @param {array} effects Array of effects after applying the filtering
         * @return {object} API
         */
        function api(effects) {

            return {

                /**
                 * Removes effects from the gameplay
                 * @return {function}
                 */
                remove: function() {

                    EventBus.getInstance().add({
                        id: 'effect/remove',
                        targets: effects
                    });

                }

            }

        }

        /**
         * returns array of effects with the exposing the activity API against them
         * @param  {mixed} filter [callback to filter effects | Array of effects | Entity]
         * @return {array} [Array of effects]
         */
        function $(filter) {
            var targets;
            if (typeof filter === 'object') {
                targets = filter;
            } else if (filter !== undefined) {
                targets = effectManager.getEffectByGUID(filter);
            }
            return api([].concat.call(targets));
        }

        /**
         * Emits an effect/create event 
         * @param {object} config configuration object for the effect
         */
        $.add = function(config) {
            if (!config) return;
            if (!config.guid) config.guid = Util.getGUID();
            EventBus.getInstance().add({
                id: 'effect/create',
                data: config
            });
        };

        return $;

    } 

    function createEmitter(config) {

        return {

            local: new Util.EventDispatcher(),
            synced: {
                entities: createEntityEventAPI(config.entityManager),
                players: createPlayerEventAPI(config.playerManager),
                effects: createEffectEventAPI(config.effectManager)
            }
        };

    }

    return {

        getInstance: function() {
            if (!singleton) {
                throw 'The instance needs to be created through "create"!';
            }
            return singleton;
        },

        create: function(config) {
            singleton = createEmitter(config);
        }
    }

});