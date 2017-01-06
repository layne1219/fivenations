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
    'Universal.EventEmitter',
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
    EventEmitter,
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
            //                              EventEmitter
            // -----------------------------------------------------------------------
            EventEmitter.create({
                playerManager: this.playerManager,
                entityManager: this.entityManager, 
                effectManager: this.effectManager
            });
            this.eventEmitter = EventEmitter.getInstance(); 

            // -----------------------------------------------------------------------
            //                              UserPointer
            // -----------------------------------------------------------------------
            UserPointer.setGame(this.game);
            this.userPointer = UserPointer.getInstance();

            // Right Mouse Button to send units to a position
            this.userPointer.on('rightbutton/down', function() {

                var coords = this.userPointer.getRealCoords();

                this.eventEmitter
                    .synced
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

                if (this.entityManager.entities().filter(function(entity) {
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
            this.userKeyboard = UserKeyboard.getInstance();

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

            this.eventEmitter.synced.players.add({
                guid: myGUID,
                name: 'Test Player',
                team: 1,
                user: true,
                authorised: true
            });

            setTimeout(function() {
                this.eventEmitter.synced.players(':user').alter({
                    titanium: 500
                });
            }.bind(this), 500);

            // -----------------------------------------------------------------------
            //                          Generating entities
            // -----------------------------------------------------------------------
            // TENTATIVE CODE SNIPPET
            for (var i = 0; i >= 0; i -= 1) {
                this.eventEmitter.synced.entities.add({
                    guid: Util.getGUID(),
                    id: 'hurricane',
                    team: 1, //Util.rnd(1, this.playerManager.getPlayersNumber())
                    x: 500 + Util.rnd(0, 100),
                    y: 450 + Util.rnd(0, 100)
                });
            }

            for (var j = 0; j >= 0; j -= 1) {
                this.eventEmitter.synced.entities.add({
                    guid: Util.getGUID(),
                    id: 'orca',
                    team: 1, //Util.rnd(1, this.playerManager.getPlayersNumber())
                    x: 200 + Util.rnd(0, 100),
                    y: 450 + Util.rnd(0, 100)
                });
            }

            setTimeout(function fire() {

                var entities = EntityManager
                    .getInstance()
                    .entities();

                this.eventEmitter.synced.entities(entities[0].getId()).fire({
                    targetEntity: entities[1]
                });

                setTimeout(fire.bind(this), 2000);

            }.bind(this), 3000);

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