import Signals from '../common/Signals';
import Graphics from '../common/Graphics';
import Scriptbox from '../common/Scriptbox';
import Map from '../map/Map';
import PlayerManager from '../players/PlayerManager';
import EntityManager from '../entities/EntityManager';
import EffectManager from '../effects/EffectManager';
import CollisionManager from '../common/CollisionManager';
import GUI from '../gui/GUI';
import GUIActivityManager from '../gui/ActivityManager';
import UserPointer from '../gui/UserPointer';
import UserKeyboard from '../gui/UserKeyboard';
import EventBusExecuter from '../sync/EventBusExecuter';
import EventEmitter from '../sync/EventEmitter';

const ns = window.fivenations;
let script;
let authoritative = false;

function Game() {}

Game.prototype = {

    init: function(params) {
        if (params) {
            script = params.script;
        }
    },

    create: function() {

        // publishing the Game object 
        ns.game = this;

        this.signals = Signals.create();

        // -----------------------------------------------------------------------
        //                                  Graphics
        // -----------------------------------------------------------------------
        // Graphics object gathering functonality that assist in rendering
        Graphics.setGame(this.game);
        this.graphics = Graphics.getInstance(true); // force new instance

        // -----------------------------------------------------------------------
        //                                  Map
        // -----------------------------------------------------------------------
        // Generate a Map
        this.map = new Map(this.game);

        // -----------------------------------------------------------------------
        //                               Player manager
        // -----------------------------------------------------------------------
        this.playerManager = PlayerManager.getInstance(true);

        // -----------------------------------------------------------------------
        //                              EntityManager
        // -----------------------------------------------------------------------
        EntityManager.setGame(this.game);
        this.entityManager = EntityManager.getInstance(true);

        // -----------------------------------------------------------------------
        //                              EffectManager
        // -----------------------------------------------------------------------
        EffectManager.setGame(this.game);
        this.effectManager = EffectManager.getInstance(true);            

        // -----------------------------------------------------------------------
        //                              CollisionManager
        // -----------------------------------------------------------------------
        CollisionManager.setGame(this.game);
        this.collisionManager = CollisionManager.getInstance();            

        // -----------------------------------------------------------------------
        //                              EventEmitter
        // -----------------------------------------------------------------------
        EventEmitter.create({
            playerManager: this.playerManager,
            entityManager: this.entityManager, 
            effectManager: this.effectManager
        });
        this.eventEmitter = EventEmitter.getInstance(); 
        this.eventEmitter.local.addEventListener('player/create', function() {
            authoritative = this.playerManager.getUser().isAuthorised();
        }.bind(this));

        // -----------------------------------------------------------------------
        //                              UserPointer
        // -----------------------------------------------------------------------
        UserPointer.setGame(this.game);
        this.userPointer = UserPointer.getInstance(true);

        // Right Mouse Button to send units to a position
        this.userPointer.on('rightbutton/down', function() {

            // @TODO refactor this function as it has become too complex and long

            var coords = this.userPointer.getRealCoords();
            var resetActivityQueue = true;
            var targetEntity;
            var entitiesHovering;

            // If the user is hovering the mouse pointer above the GUI, the selection must remain untouched
            if (GUI.getInstance().isHover()) {
                this.userPointer.dispatch('rightbutton/down/gui');
                return;
            }

            // checks whether the user hovers an entity
            entitiesHovering = this.entityManager.entities().filter(function(entity) {
                if (entity.isHover()){
                    targetEntity = entity;
                    return true;
                } else {
                    return false;
                }
            });

            if (UserKeyboard.getInstance().isDown(Phaser.KeyCode.SHIFT)) {
                resetActivityQueue = false;
            }

            if (entitiesHovering.length > 0) {

                var selectedEntities = this.eventEmitter.synced.entities(':user:selected');

                // if the entity is hostile we should trigger the attack short hand
                if (this.playerManager.isEntityHostileToPlayer(targetEntity, this.playerManager.getUser())) {

                    selectedEntities.attack({
                        targetEntity: targetEntity,
                        resetActivityQueue: resetActivityQueue
                    });
                    
                } else {

                    // short hand for follow
                    selectedEntities.follow({
                        targetEntity: targetEntity,
                        resetActivityQueue: resetActivityQueue
                    });

                }

                targetEntity.selectedAsTarget();

            } else {

                this.eventEmitter
                    .synced
                    .entities(':user:selected:not(building)')
                    .move({
                        x: coords.x,
                        y: coords.y,
                        resetActivityQueue: resetActivityQueue
                    });

                this.GUI.putClickAnim(coords.x, coords.y);

            }                          

        }.bind(this));

        // Unselecting units when clicking over an area with no entities underneath
        this.userPointer.on('leftbutton/down', function(mousePointer) {

            // If the user is hovering the mouse pointer above the GUI, the selection must remain untouched
            if (GUI.getInstance().isHover()) {
                this.userPointer.dispatch('leftbutton/down/gui');
                return;
            }

            if (this.guiActivityManager.hasActiveSelection()) {
                this.userPointer.dispatch('leftbutton/down/activity', mousePointer);
                return;
            }

            if (this.entityManager.entities().filter(function(entity) {
                return entity.isHover();
            }).length === 0) {
                this.userPointer.dispatch('leftbutton/down/disselect');
                return;
            }

        }.bind(this));

        // @TODO test code delete it
        this.userPointer.on('rightbutton/down', () => {
            if (!window.editorMode) return;
            var coords = this.userPointer.getRealCoords();
            
            this.eventEmitter.synced.entities.add({
                id: window.currEntityId || 'hurricane',
                team: window.currEntityTeam || 1,
                x: coords.x || (50 + Math.random() * 700),
                y: coords.y || (50 + Math.random() * 700)
            });
            console.log(window.currEntityId, coords.x, coords.y);          
        });

        // If the user pointer isn't over the GUI area, nor any entities
        this.userPointer.on('leftbutton/down/disselect', function() {
            this.entityManager.unselectAll();
        }.bind(this));

        this.userPointer.on('multiselector/up', function(multiselector) {

            this.entityManager.entities().forEach(function(entity) {
                if (!entity.isEntityControlledByUser()) {
                    return;
                }
                if (entity.isInside(multiselector)) {
                    entity.select();
                }
            });

        }.bind(this));

        // -----------------------------------------------------------------------
        //                              UserKeyboard
        // -----------------------------------------------------------------------
        // Set up UserKeyboard
        UserKeyboard.setGame(this.game);
        this.userKeyboard = UserKeyboard.getInstance(true);

        this.userKeyboard
            .on('cursor/down', this.map.scrollDown.bind(this.map))
            .on('cursor/up', this.map.scrollUp.bind(this.map))
            .on('cursor/left', this.map.scrollLeft.bind(this.map))
            .on('cursor/right', this.map.scrollRight.bind(this.map));

        this.userKeyboard
            .on('key/delete', function(){
                this.eventEmitter.synced.entities(':selected').remove();
            }.bind(this));

        // -----------------------------------------------------------------------
        //                              GUI
        // -----------------------------------------------------------------------
        // Set up the GUI object 
        this.GUI = GUI.setGame(this.game)
            .setMap(this.map)
            .setEntityManager(this.entityManager)
            .setUserPointer(this.userPointer)
            .setPlayerManager(this.playerManager)
            .getInstance(true);

        // -----------------------------------------------------------------------
        //                              Scriptbox
        // -----------------------------------------------------------------------
        this.scriptbox = Scriptbox.getInstance();
        this.scriptbox.run(script || 'default', this);

        // -----------------------------------------------------------------------
        //                              GUI.ActivityManager
        // -----------------------------------------------------------------------
        this.guiActivityManager = GUIActivityManager.getInstance();

        // -----------------------------------------------------------------------
        //                              Physic engine
        // -----------------------------------------------------------------------
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // -----------------------------------------------------------------------
        //                                EventBus
        // -----------------------------------------------------------------------
        this.eventBusExecuter = EventBusExecuter.getInstance();

        // -----------------------------------------------------------------------
        //                                QuadTree
        // -----------------------------------------------------------------------
        this.entityManager.createQuadTree(this.map);

    },

    update: function() {

        // Execute all the registered events on the EventBus
        this.eventBusExecuter.run();

        // Rendering the map
        this.map.update(this.entityManager);

        if (this.paused !== true) {
            // updating entity attributes according to the time elapsed
            this.entityManager.update(authoritative, this.game.time.elapsedMS);

            // updates effects
            this.effectManager.update(authoritative);

            // collision handling
            this.collisionManager.update(authoritative);
        }

        // Rendering GUI elements
        this.GUI.update();

        // User input - mouse/touch
        this.userPointer.update();

        // User input - keyboard
        this.userKeyboard.update();

        this.game.time.advancedTiming = true;
        this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00');
    }

};

export default Game;
