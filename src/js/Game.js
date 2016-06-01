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

        calculateDelta: function(){
            var now = new Date().getTime();
            this.delta = now - (lastTickTime || now);
            lastTickTime = now;
        },

        preloader: function(){

        },

        create: function () {

            // preventing the context menu to appear when the user clicks with the right mouse button
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

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
            //                                  Players
            // -----------------------------------------------------------------------
            // Set up Players
            this.playerManager = PlayerManager.getInstance();
            this.playerManager.addPlayer( { team: 1, user: true } );
            this.playerManager.addPlayer( { team: 2 });
            this.playerManager.addPlayer( { team: 3 });
            this.playerManager.addPlayer( { team: 4 });

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
            this.userPointer.on('rightbutton/down', function(userPointer){

                var coords = this.userPointer.getRealCoords();

                this.entityManager
                    .select(function(entity){
                        return entity.isSelected() && entity.isEntityControlledByUser(entity)
                    })
                    .move({x: coords.x, y: coords.y});

                this.GUI.putClickAnim(coords.x, coords.y);
                    
            }.bind(this));

            // Unselecting units when clicking over an area with no entities underneath
            this.userPointer.on('leftbutton/down', function(mousePointer){

                // If the user is hovering the mouse pointer above the GUI, the selection must remain untouched
                if (GUI.getInstance().isHover()){
                    this.userPointer.dispatch('leftbutton/down/gui');
                    return;
                }

                if (this.guiActivityManager.hasActiveSelection()){
                    this.userPointer.dispatch('leftbutton/down/activity', mousePointer);
                    return;
                }

                if (this.entityManager.get().filter(function(entity){
                    return entity.isHover();
                }).length === 0){
                    this.userPointer.dispatch('leftbutton/down/disselect');
                    return;
                }

                gui.frame++;
                console.log(gui.frame);

            }.bind(this));

            // If the user pointer isn't over the GUI area, nor any entities
            this.userPointer.on('leftbutton/down/disselect', function(){
                this.entityManager.unselectAll();
            }.bind(this));

            this.userPointer.on('multiselector/up', function(multiselector){

                this.entityManager.get().forEach(function(entity){
                    if (!entity.isEntityControlledByUser()){
                        return;
                    }
                    if (entity.isInside(multiselector)){
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

            // -----------------------------------------------------------------------
            //                              GUI
            // -----------------------------------------------------------------------
            // Set up the GUI object 
            this.GUI = GUI.setGame(this.game)
                          .setMap(this.map)
                          .setEntityManager(this.entityManager)
                          .setUserPointer(this.userPointer)
                          .getInstance();

            gui = this.game.add.sprite(10, 10, 'gui.icons.fed');
            gui.visible = true;
            gui.frame = 102;
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
            //                          Generating entities
            // -----------------------------------------------------------------------
            // TENTATIVE CODE SNIPPET
            for (var i = 25; i >= 0; i--) {
                this.entityManager.add({
                    id: Util.rnd(1, 2) === 1 ? 'hurricane' : 'orca',
                    team: 1//Util.rnd(1, this.playerManager.getPlayersNumber())
                });
            }

            this.entityManager.add({
                id: "orca",
                team: 1
            });

            this.entityManager.add({
                id: "hailstorm",
                team: 1
            });            

            this.entityManager.add({
                id: "stgeorge",
                team: 1
            });

            this.entityManager.add({
                id: "avenger",
                team: 1
            });

            this.entityManager.add({
                id: "avenger2",
                team: 1
            });

            this.entityManager.add({
                id: "icarus",
                team: 1
            });

            this.entityManager.add({
                id: "kutuzov",
                team: 1
            });

            this.entityManager.add({
                id: "teller",
                team: 1
            });

            this.entityManager.add({
                id: "dresda",
                team: 1
            });

            var crow = this.entityManager.add({
                id: "crow",
                team: 1
            });
            crow.patrol( 400, 400 );

            this.entityManager.add({
                id: "engineershuttle",
                team: 1
            });

            this.entityManager.add({
                id: "commandcenter",
                team: 1,
                x: 250,
                y: 250
            });                                                          

            this.entityManager.get().forEach(function(entity){
                if (entity === crow){
                    return;
                }
                entity.moveTo(Util.rnd(0, 500), Util.rnd(0, 500));
            });
            
        },

        update: function () {

            // Calculates delta
            this.calculateDelta();

            // Execute all the registered events on the EventBus
            this.game.eventBusExecuter.run();

            // Rendering the map
            this.map.update();

            // Rendering the units
            this.entityManager.get().forEach(function(entity){
                entity.update();
            });

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
