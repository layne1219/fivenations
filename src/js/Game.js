define('Game', [
    'Map',
    'PlayerManager', 
    'EntityManager',
    'GUI',
    'UserPointer', 
    'UserKeyboard', 
    'Util'
], function(Map, PlayerManager, EntityManager, GUI, UserPointer, UserKeyboard, Util) {
    'use strict';

    var ns = window.fivenations,
        gui;

    function Game() {}    

    Game.prototype = {

        preloader: function(){

        },

        create: function () {

            // preventing the context menu to appear when the user clicks with the right mouse button
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

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
            this.userPointer.on('rightbutton/down', (function(){

                var camera = this.game.camera,
                    mousePointer = this.game.input.mousePointer,
                    x = camera.x + mousePointer.x,
                    y = camera.y + mousePointer.y,

                    entities = this.entityManager.getAllSelected().filter(function(entity){
                        return EntityManager.getInstance().isEntityControlledByUser(entity);
                    });

                // send the selected units to the specified coordinates
                if (entities.length > 0){
                    entities.forEach(function(entity){
                        entity.moveTo(x, y);
                    });

                    // put the click animation to the game scene
                    this.GUI.putClickAnim(x, y);
                }

                if (gui.frame > 0){
                    gui.frame--;
                }
                console.log(gui.frame);
                    
            }).bind(this));

            // Unselecting units when clicking over an area with no entities underneath
            this.userPointer.on('leftbutton/down', (function(){

                if (this.entityManager.getAllHover().length === 0){
                    this.entityManager.unselectAll();
                }

                gui.frame++;
                console.log(gui.frame);  

            }).bind(this));

            this.userPointer.on('multiselector/up', (function(multiselector){

                this.entityManager.get().forEach(function(entity){
                    if (!EntityManager.getInstance().isEntityControlledByUser(entity)){
                        return;
                    }
                    if (entity.isInside(multiselector)){
                        entity.select();
                    }
                });              

            }).bind(this));

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
            //gui.visible = false;
            gui.frame = 15;

            // -----------------------------------------------------------------------
            //                              Physic engine
            // -----------------------------------------------------------------------
            // Activating the basic physic engine 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

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
            this.entityManager.get().forEach(function(entity){
                entity.moveTo(Util.rnd(0, 500), Util.rnd(0, 500));
            });
            
        },

        update: function () {

            // Rendering the map
            this.map.update();

            // Rendering the units
            this.entityManager.get().forEach(function(entity){
                entity.update();
            });

            // Rendering GUI elements
            this.GUI.update();

            // Rendering the Selector
            this.userPointer.update();

            // Dispathcing events when holding a key down
            this.userKeyboard.update();

            this.game.time.advancedTiming = true;
            this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00');  
        }

    };

  return Game;
});
