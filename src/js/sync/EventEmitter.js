import EventBus from './EventBus';
import Util from '../common/Util';

let singleton;

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
       * Make all the given entities relocated at the given coordinates
       * @param  {object} options [configuration object to create the desired event]
       * @return {this}
       * @chainable
       */
      place(options) {
        const data = {
          x: options.x,
          y: options.y,
        };

        EventBus.getInstance().add({
          id: 'entity/place',
          targets: entities,
          data,
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Make all the given entities to move to the given coordinates
       * @param  {object} options [configuration object to create the desired event]
       * @return {this}
       * @chainable
       */
      move(options) {
        const entityNumber = entities.length;
        const rnd = entityNumber === 1 ? 0 : entityNumber * 4;
        const data = (() => {
          const coords = [];
          for (let i = entityNumber - 1; i >= 0; i -= 1) {
            coords.push({
              x: options.x - rnd / 2 + Util.rnd(0, rnd),
              y: options.y - rnd / 2 + Util.rnd(0, rnd),
            });
          }
          return coords;
        })();

        EventBus.getInstance().add({
          id: 'entity/move',
          targets: entities,
          data,
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Makes all the given entities to follow the given target entity
       * @param  {object} options [configuration object to create the desired event]
       * @return {this}
       * @chainable
       */
      follow(options) {
        const { targetEntity } = options;
        if (!targetEntity) return this;

        EventBus.getInstance().add({
          id: 'entity/follow',
          targets: entities,
          data: {
            targetEntity: targetEntity.getGUID(),
          },
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Makes all the given entities to patrol between the current and given coordinates
       * @param  {object} options [configuration object to create the desired event]
       * @return {this}
       * @chainable
       */
      patrol(options) {
        EventBus.getInstance().add({
          id: 'entity/patrol',
          targets: entities,
          data: options,
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Makes all given entities to perform a stop action
       * @return {this}
       * @chainable
       */
      stop(options) {
        EventBus.getInstance().add({
          id: 'entity/stop',
          targets: entities,
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Removes entities from the game
       * @return {this}
       * @chainable
       */
      remove() {
        EventBus.getInstance().add({
          id: 'entity/remove',
          targets: entities,
        });

        return this;
      },
      /**
       * Removes all registered activities from the entity's
       * entity manager instance
       * @return {this}
       * @chainable
       */
      reset() {
        EventBus.getInstance().add({
          id: 'entity/reset',
          targets: entities,
        });

        return this;
      },
      /**
       * Executes the attached logic for firing the given weapons
       * @return {this}
       * @chainable
       */
      fire(options) {
        const { targetEntity } = options;
        const weaponGUIDs = [];
        let weaponCount = 0;

        if (!targetEntity) return this;

        entities.forEach((entity, idx) => {
          weaponGUIDs[idx] = entity
            .getWeaponManager()
            .getWeaponsCanFireEntity(targetEntity)
            .map((weapon) => {
              weaponCount += 1;
              return weapon.getGUID();
            });
        });

        if (weaponCount) {
          EventBus.getInstance().add({
            id: 'entity/fire',
            targets: entities,
            data: {
              weaponGUIDs,
              targetEntity: targetEntity.getGUID(),
            },
            resetActivityQueue: options.resetActivityQueue,
          });
        }

        return this;
      },
      /**
       * Executes the attached logic for attack the given target
       * @return {this}
       * @chainable
       */
      attack(options) {
        const { targetEntity } = options;
        if (!targetEntity) return this;

        EventBus.getInstance().add({
          id: 'entity/attack',
          targets: entities,
          data: {
            targetEntity: targetEntity.getGUID(),
            addAsLast: options.addAsLast,
          },
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Inflicts a defined damage to the specify entities
       * @return {this}
       * @chainable
       */
      damage(options) {
        const { weapon } = options;
        const data = {
          damage: weapon.getDamage(),
          damageShield: weapon.getDamageShield(),
        };
        const emitter = weapon.getManager().getEntity();

        if (emitter) {
          data.emitterEntity = emitter.getGUID();
        }

        EventBus.getInstance().add({
          id: 'entity/damage',
          targets: entities,
          data,
        });

        return this;
      },
      /**
       * Executes the attached logic for getting to the given target in order to dock
       * @return {this}
       * @chainable
       */
      getToDock(options) {
        const { targetEntity } = options;
        if (!targetEntity) return this;

        EventBus.getInstance().add({
          id: 'entity/getToDock',
          targets: entities,
          data: {
            targetEntity: targetEntity.getGUID(),
            addAsLast: options.addAsLast,
          },
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Docks entities into the target entity
       * @return {this}
       * @chainable
       */
      dock(options) {
        const { targetEntity } = options;
        if (!targetEntity) return this;

        EventBus.getInstance().add({
          id: 'entity/dock',
          targets: entities,
          data: {
            targetEntity: targetEntity.getGUID(),
          },
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Undocks entities from the specified entity
       * @return {this}
       * @chainable
       */
      undock(options) {
        const resetActivityQueue =
          (options && options.resetActivityQueue) || false;

        EventBus.getInstance().add({
          id: 'entity/undock',
          targets: entities,
          data: {
            rnd: entities.map((entity) => {
              const dockCapacity = entity.getDataObject().getMaxHangar();
              const randomFactors = [];
              for (let i = dockCapacity - 1; i >= 0; i -= 1) {
                randomFactors.push(Math.random());
              }
              return randomFactors;
            }),
          },
          resetActivityQueue,
        });

        return this;
      },
      /**
       * Executes the attached logic of mining the given target resource
       * @return {this}
       * @chainable
       */
      mine(options) {
        const { targetEntity } = options;
        if (!targetEntity) return this;

        EventBus.getInstance().add({
          id: 'entity/mine',
          targets: entities,
          data: {
            targetEntity: targetEntity.getGUID(),
          },
          resetActivityQueue: options.resetActivityQueue,
        });

        return this;
      },
      /**
       * Alters the resources in the cargo area
       * @return {this}
       * @chainable
       */
      alterCargo(options) {
        EventBus.getInstance().add({
          id: 'entity/cargo/alter',
          targets: entities,
          data: options,
        });

        return this;
      },
    };
  }

  /**
   * returns array of entities with the exposing the activity API against them
   * @param  {mixed} filter [callback to filter entities | Array of Entities | Entity]
   * @return {array} [Array of entities]
   */
  function $(filter) {
    const selector = entityManager.getSelector(entityManager.entities());
    const entities = selector(filter);
    return eventAPI([].concat.call(entities));
  }

  /**
   * Emits an 'entity/create' event
   * @param {object} config - object holding the details of the creation
   * @return {object} Promise - resolved when the 'entity/create' event is
   * executed
   */
  $.add = (config) => {
    if (!config) return null;
    if (!config.guid) config.guid = Util.getGUID();
    if (!config.createdAt) config.createdAt = new Date().getTime();
    // we return a promise that is resolved when the event is
    // executed. The promise is created to propagate the GUID to
    // higher level logic so that external code is notified when
    // the newly generated entity is placed in the EntityManager
    return new Promise((resolve) => {
      EventBus.getInstance().add({
        id: 'entity/create',
        data: config,
        // the promise will return the GUID regardless of what else
        // is added inside of the EventBus
        callback: resolve.bind(null, config.guid),
      });
    });
  };

  return $;
}

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
      alter(config) {
        players.forEach((player) => {
          const data = Object.create(config);
          data.guid = player.getGUID();
          EventBus.getInstance().add({
            id: 'player/resource/alter',
            data,
          });
        });
      },
    };
  }

  /**
   * returns array of players with the exposing the activity API against them
   * @param  {mixed} filter [callback to filter players | Array of players | Entity]
   * @return {array} [Array of players]
   */
  function $(filter) {
    let targets;
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
  $.add = (config) => {
    if (!config) return;
    if (!config.guid) config.guid = Util.getGUID();
    EventBus.getInstance().add({
      id: 'player/create',
      data: config,
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
      remove() {
        EventBus.getInstance().add({
          id: 'effect/remove',
          targets: effects,
        });
      },
    };
  }

  /**
   * returns array of effects with the exposing the activity API against them
   * @param  {mixed} filter [callback to filter effects | Array of effects | Entity]
   * @return {array} [Array of effects]
   */
  function $(filter) {
    let targets;
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
  $.add = (config) => {
    if (!config) return;
    if (!config.guid) config.guid = Util.getGUID();
    EventBus.getInstance().add({
      id: 'effect/create',
      data: config,
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
      effects: createEffectEventAPI(config.effectManager),
    },
  };
}

export default {
  getInstance() {
    if (!singleton) {
      throw new Error('The instance needs to be created through "create"!');
    }
    return singleton;
  },

  create(config) {
    singleton = createEmitter(config);
  },
};
