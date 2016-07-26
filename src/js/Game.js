define('Game', [
    'Graphics',
    'Map',
    'PlayerManager',
    'EntityManager',
    'GUI',
    'GUI.ActivityManager',
    'UserPointer',
    'UserKeyboard',
    'Universal.EventBusExecuter',
    'Util'
], function(
    Graphics,
    Map,
    PlayerManager,
    EntityManager,
    GUI,
    GUIActivityManager,
    UserPointer,
    UserKeyboard,
    EventBusExecuter,
    Util) {

    'use strict';

    var ns = window.fivenations,
        gui,
        lastTickTime;

    function Game() {}

    Game.prototype = {

        setLastTickTime: function() {
            lastTickTime = new Date().getTime();
        },

        getDelta: function() {
            var now = new Date().getTime(),
                delta = now - (lastTickTime || now);
            return delta;
        },

        preloader: function() {

        },

        create: function() {

            // preventing the context menu to appear when the user clicks with the right mouse button
            this.game.canvas.oncontextmenu = function(e) {
                e.preventDefault();
            };

            // publishing the Game object 
            ns.game = this;

            // -----------------------------------------------------------------------
            //                                  Graphics
            // -----------------------------------------------------------------------
            // Graphics object gathering functonality that assist in rendering
            Graphics.setGame(this.game);
            this.graphics = Graphics.getInstance();

            // -----------------------------------------------------------------------
            //                                  Map
            // -----------------------------------------------------------------------
            // Generate a Map
            this.map = new Map();
            this.map.setGame(this.game);
            
            // -----------------------------------------------------------------------
            //                              EntityManager
            // -----------------------------------------------------------------------
            // Set up the EntityManager
            EntityManager.setGame(this.game);
            this.entityManager = EntityManager.getInstance();

            // -----------------------------------------------------------------------
            //                              UserPointer
            // -----------------------------------------------------------------------
            // Set up User pointer
            UserPointer.setGame(this.game);
            this.userPointer = UserPointer.getInstance();

            // Right Mouse Button to send units to a position
            this.userPointer.on('rightbutton/down', function() {

                var coords = this.userPointer.getRealCoords();

                this.entityManager
                    .entities(function(entity) {
                        return entity.isSelected() && entity.isEntityControlledByUser(entity)
                    })
                    .move({
                        x: coords.x,
                        y: coords.y
                    });

                this.GUI.putClickAnim(coords.x, coords.y);

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

                if (this.entityManager.entities().raw().filter(function(entity) {
                    return entity.isHover();
                }).length === 0) {
                    this.userPointer.dispatch('leftbutton/down/disselect');
                    return;
                }

            }.bind(this));

            // If the user pointer isn't over the GUI area, nor any entities
            this.userPointer.on('leftbutton/down/disselect', function() {
                this.entityManager.unselectAll();
            }.bind(this));

            this.userPointer.on('multiselector/up', function(multiselector) {

                this.entityManager.entities().raw().forEach(function(entity) {
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
            this.userKeyboard = UserKeyboard.getInstance();

            this.userKeyboard
                .on('cursor/down', this.map.scrollDown.bind(this.map))
                .on('cursor/up', this.map.scrollUp.bind(this.map))
                .on('cursor/left', this.map.scrollLeft.bind(this.map))
                .on('cursor/right', this.map.scrollRight.bind(this.map));

            this.userKeyboard
                .on('key/delete', function(){
                    this.entityManager.entities(':selected').remove();
                }.bind(this));

            // -----------------------------------------------------------------------
            //                              GUI
            // -----------------------------------------------------------------------
            // Set up the GUI object 
            this.GUI = GUI.setGame(this.game)
                .setMap(this.map)
                .setEntityManager(this.entityManager)
                .setUserPointer(this.userPointer)
                .getInstance();

            gui = this.game.add.sprite(10, 10, 'gui');
            gui.visible = true;
            gui.frame = 1;
            Graphics.getInstance().getGroup('entities').add(gui);

            // -----------------------------------------------------------------------
            //                              GUI.ActivityManager
            // -----------------------------------------------------------------------
            // Set up the GUI.ActivityManager
            this.guiActivityManager = GUIActivityManager.getInstance();

            // -----------------------------------------------------------------------
            //                              Physic engine
            // -----------------------------------------------------------------------
            // Activating the basic physic engine 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // -----------------------------------------------------------------------
            //                                EventBus
            // -----------------------------------------------------------------------
            // Kicking off the main event loop
            this.game.eventBusExecuter = EventBusExecuter.getInstance();

            // -----------------------------------------------------------------------
            //                                  Players
            // -----------------------------------------------------------------------
            // Set up Players
            EventBus.getInstance().add({
                id: 'player/create',
                data: {
                    guid: Util.getGUID(),
                    name: 'Test Player',
                    team: 1
                }
            });

            // -----------------------------------------------------------------------
            //                          Generating entities
            // -----------------------------------------------------------------------
            // TENTATIVE CODE SNIPPET
            for (var i = 25; i >= 0; i -= 1) {
                this.entityManager.entities.add({
                    guid: Util.getGUID(),
                    id: Util.rnd(1, 2) === 1 ? 'hurricane' : 'orca',
                    team: 1, //Util.rnd(1, this.playerManager.getPlayersNumber())
                    x: 500 + Util.rnd(0, 100),
                    y: 450 + Util.rnd(0, 100)
                });
            }

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'defenseplatform',
                team: 1,
                x: 450, 
                y: 200
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'astrometricstation',
                team: 1,
                x: 650, 
                y: 210
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'civilianbase',
                team: 1,
                x: 66, 
                y: 650
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'defensesatellite',
                team: 1,
                x: 600, 
                y: 777
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'dockyard',
                team: 1,
                x: 200, 
                y: 120
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'fleetheadquarters',
                team: 1,
                x: 250, 
                y: 400
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'fusionreactor',
                team: 1,
                x: 580, 
                y: 400
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'merchantport',
                team: 1,
                x: 100, 
                y: 520
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'miningstation',
                team: 1,
                x: 589, 
                y: 677
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'researchcenter',
                team: 1,
                x: 700, 
                y: 135
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'shipfactory',
                team: 1,
                x: 400, 
                y: 400
            });

            this.entityManager.entities.add({
                guid: Util.getGUID,
                id: 'solarstation',
                team: 1,
                x: 322, 
                y: 499
            });                               

            this.entityManager.entities().move({ 
                x: Util.rnd(0, 500),
                y: Util.rnd(0, 500)
            });

        },

        update: function() {

            this.setLastTickTime();

            // Execute all the registered events on the EventBus
            this.game.eventBusExecuter.run();

            // Rendering the map
            this.map.update();

            // updating entity attributes according to the time elapsed
            this.entityManager.update(this.getDelta());

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

    return Game;
});