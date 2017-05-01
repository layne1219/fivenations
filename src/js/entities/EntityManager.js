import Graphics from '../common/Graphics';
import Entity from './Entity';
import DataObject from '../model/DataObject';
import QuadTree from '../common/QuadTree';
import Util from '../common/Util';

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

    this.updateEntityDistancesOptimised = Util.interval(this.updateEntityDistances, 100, this);

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
        // when an entity is removed we've got to refresh the quad tree
        this.updateEntityDistances();
    },

    /**
     * Alters entity attributes 
     * @param {integer} elapsedTime [elpased time since the last registered tick]
     * @return {void}
     */
    update: function(authoritative, elapsedTime) {
        this.updateEntityDistancesOptimised();
        this.updateEntities(authoritative, elapsedTime);
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
     * Initialises a QuadTree to filter candidates for InRange typed functions
     * @param  {object} map Map instance
     * @return {void}
     */
    initQuadTree: function(map) {
        if (!map) throw 'Invalid Map instance has been passed!';

        this.quadTree = new QuadTree({
            x: 0,
            y: 0,
            width: map.getScreenWidth(),
            height: map.getScreenHeight()
        });
    },


    /**
     * Updates the closest sibling of all the entities. With this information
     * we can easily and efficiently check whether there is an entity in range.
     * @return {void}
     */
    updateEntityDistances: function() {
        this.updateQuadTree();
        for (var i = entities.length - 1; i >= 0; i -= 1) {
            this.setClosestEntities(entities[i]);
        }
    },

    /**
     * Updates QuadTree according to the current state of the entity array
     * @return {void}
     */
    updateQuadTree: function() {
        if (!this.quadTree) throw 'QuadTree has not been implemented!';
        this.quadTree.clear();
        for (var i = entities.length - 1; i >= 0; i -= 1) {
            this.quadTree.insert( entities[i].getSprite() );
        }
    },        

    /**
     * Sets the closest entities to the given entity
     * @param {object} entity Entity instance
     * @return {void}
     */
    setClosestEntities: function(entity) {
        if (!entity) throw 'Invalid Entity instance is passed!';

        var entities = this.getEntitiesInRange(entity);
        var closestEnemy = null;
        var closestAlly = null;

        for (var i = entities.length - 1; i >= 0; i -= 1) {
            if (!closestEnemy && entities[i].isEnemy(entity)) {
                closestEnemy = entities[i];
            } else if (!closestAlly) {
                closestAlly = entities[i];
            }
            if (closestEnemy && closestAlly) break;
        }

        entity.setClosestHostileEntityInRange(closestEnemy);
        entity.setClosestAllyEntityInRange(closestAlly);
    },

    /**
     * Returns an array of candidates that are in range to the given entity
     * @param  {[type]} entity [description]
     * @return {[type]}        [description]
     */
    getEntitiesInRange: function(entity) {
        var range = entity.getWeaponManager().getMaxRange();
        var sprite = entity.getSprite();
        var candidates = this.quadTree.retrieve( sprite );
        return candidates
            .map(function(candidate) {
                return [Util.distanceBetweenSprites(sprite, candidate), candidate];
            })
            .filter(function(data) {
                if (data[1] === sprite) return false;
                if (data[1]._parent.isHibernated()) return false;
                return data[0] <= range;
            })
            .sort(function(a, b) {
                return a[0] < b[0];
            })
            .map(function(data) {
                return data[1]._parent;
            });
    },

    /**
     * Updates each entities 
     * @return {void}
     */
    updateEntities: function(authoritative, elapsedTime) {
        var steps = Math.ceil(elapsedTime / (1000 / 60));
        for (var i = entities.length - 1; i >= 0; i -= 1) {
            this.updateEntity(entities[i], steps, authoritative);
        }            
    },

    /**
     * Invokes entity's update function according to the current step cycles
     * @param  {object} entity Entity instance
     * @return {void}
     */
    updateEntity: function(entity, steps, authoritative) {
        while (steps) {
            entity.update(authoritative);
            steps -= 1;
        }
    },        

    /**
     * returns the subsection of the attributes of the given entities
     * @param  {array} entities [Array of the given entities]
     * @return {object} consolidated object of attributes
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
            } else if (filter === ':user:selected:not(building)') {
                targets = entities.filter(function(entity) {
                    if (!entity.isEntityControlledByUser()) return false;
                    if (!entity.isSelected()) return false;
                    if (entity.getDataObject().isBuilding()) return false;
                    return true;
                });
            } else {
                targets = entities.filter(function(entity) {
                    return entity.getGUID() === filter;
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

export default {

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
