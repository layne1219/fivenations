define('Game', [
    'Game.Signals',
    'Graphics',
    'Map',
    'PlayerManager',
    'EntityManager',
    'EffectManager',
    'GUI',
    'GUI.ActivityManager',
    'UserPointer',
    'UserKeyboard',
    'Universal.EventBus',
    'Universal.EventBusExecuter',
    'Util'
], function(
    Signals,
    Graphics,
    Map,
    PlayerManager,
    EntityManager,
    EffectManager,
    GUI,
    GUIActivityManager,
    UserPointer,
    UserKeyboard,
    EventBus,
    EventBusExecuter,
    Util) {

    'use strict';

    var ns = window.fivenations;

    function Game() {}

    Game.prototype = {

        preloader: function() {

        },

        create: function() {

            // preventing the context menu to appear when the user clicks with the right mouse button
            this.game.canvas.oncontextmenu = function(e) {
                e.preventDefault();
            };

            // publishing the Game object 
            ns.game = this;

            this.signals = Signals.create();

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
            this.map = new Map({
                width: 128,
                height: 128
            });
            this.map.setGame(this.game);

            // -----------------------------------------------------------------------
            //                               Player manager
            // -----------------------------------------------------------------------
            this.playerManager = PlayerManager.getInstance();

            // -----------------------------------------------------------------------
            //                              EntityManager
            // -----------------------------------------------------------------------
            EntityManager.setGame(this.game);
            this.entityManager = EntityManager.getInstance();

            // -----------------------------------------------------------------------
            //                              EffectManager
            // -----------------------------------------------------------------------
            EffectManager.setGame(this.game);
            this.effectManager = EffectManager.getInstance();            

            // -----------------------------------------------------------------------
            //                              UserPointer
            // -----------------------------------------------------------------------
            UserPointer.setGame(this.game);
            this.userPointer = UserPointer.getInstance();

            // Right Mouse Button to send units to a position
            this.userPointer.on('rightbutton/down', function() {

                var coords = this.userPointer.getRealCoords();

                this.entityManager
                    .entities(':user:selected')
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
                .setPlayerManager(this.playerManager)
                .getInstance();

            /*window.gui = this.game.add.sprite(10, 10, 'gui.icons.obj');
            window.gui.visible = true;
            window.gui.frame = 1;
            Graphics.getInstance().getGroup('entities').add(gui);*/

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
            
            var myGUID = Util.getGUID();
            // Set up Players
            EventBus.getInstance().add({
                id: 'player/create',
                data: {
                    guid: myGUID,
                    name: 'Test Player',
                    team: 1,
                    user: true
                }
            });

            EventBus.getInstance().add({
                id: 'player/resource/alter',
                data: {
                    guid: myGUID,
                    titanium: 50
                }
            });            

            // -----------------------------------------------------------------------
            //                          Generating entities
            // -----------------------------------------------------------------------
            // TENTATIVE CODE SNIPPET
            for (var i = 20; i >= 0; i -= 1) {
                this.entityManager.entities.add({
                    guid: Util.getGUID(),
                    id: 'hurricane',
                    team: 1, //Util.rnd(1, this.playerManager.getPlayersNumber())
                    x: 500 + Util.rnd(0, 100),
                    y: 450 + Util.rnd(0, 100)
                });
            }

            for (var j = 20; j >= 0; j -= 1) {
                this.entityManager.entities.add({
                    guid: Util.getGUID(),
                    id: 'orca',
                    team: 1, //Util.rnd(1, this.playerManager.getPlayersNumber())
                    x: 200 + Util.rnd(0, 100),
                    y: 450 + Util.rnd(0, 100)
                });
            }

            [
                'blackhole',
                'nebulacloud',
                'sporecloud',
                'destructivefield'
            ].forEach(function(id) {

                EventBus.getInstance().add({
                    id: 'effect/create',
                    data: {
                        id: id,
                        x: Util.rnd(0, 800),
                        y: Util.rnd(0, 600)
                    }
                });

            });

            for (var d = 20; d >= 0; d -= 1) {
                this.effectManager.add({
                    id: 'laser-beam-1',
                    x: Util.rnd(0, 600),
                    y: Util.rnd(0, 500),
                    angle: 0,
                    velocity: 10
                });         
            }
        },

        update: function() {

            // Execute all the registered events on the EventBus
            this.game.eventBusExecuter.run();

            // Rendering the map
            this.map.update(this.entityManager);

            // updating entity attributes according to the time elapsed
            this.entityManager.update(this.game.time.elapsedMS);

            // updates effects
            this.effectManager.update();

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