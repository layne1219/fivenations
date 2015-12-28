define('Game', [
    'Map', 
    'EntityManager',
    'GUI',
    'UserPointer', 
    'UserKeyboard', 
    'Util'
], function(Map, EntityManager, GUI, UserPointer, UserKeyboard, Util) {
    'use strict';

    var ns = window.fivenations,
        gui;

    function Game() {}    

    Game.prototype = {

        preloader: function(){

        },

        create: function () {

            // preventing the context menu to appear when the user clicks with the right mouse button
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

            // -----------------------------------------------------------------------
            //                                  Map
            // -----------------------------------------------------------------------
            // Generate a Map
            this.map = new Map();
            this.map.append(this.game);

            // -----------------------------------------------------------------------
            //                              EntityManager
            // -----------------------------------------------------------------------
            // Set up the EntityManager
            EntityManager.setGame(this.game);
            this.entityManager = EntityManager.getInstance();

            // -----------------------------------------------------------------------
            //                              GUI
            // -----------------------------------------------------------------------
            // Set up the GUI object 
            GUI.setGame(this.game);
            this.GUI = GUI.getInstance();

            gui = this.game.add.sprite(10, 10, 'gui');
            gui.frame = 162;

            // -----------------------------------------------------------------------
            //                              UserPointer
            // -----------------------------------------------------------------------
            // Set up User pointer
            UserPointer.setGame(this.game);
            this.userPointer = UserPointer.getInstance();

            // Right Mouse Button to send units to a position
            this.userPointer.on('rightmousedown', (function(){

                var camera = this.game.camera,
                    mousePointer = this.game.input.mousePointer,
                    x = camera.x + mousePointer.x,
                    y = camera.y + mousePointer.y,

                    entities = this.entityManager.getAllSelected();

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
            this.userPointer.on('leftmousedown', (function(){

                if (this.entityManager.getAllHover().length === 0){
                    this.entityManager.unselectAll();
                }

                gui.frame++;
                console.log(gui.frame);  

            }).bind(this));

            this.userPointer.on('multiselectorup', (function(multiselector){
                
                this.entityManager.get().forEach(function(entity){
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
            this.UserKeyboard = UserKeyboard.getInstance();


            // -----------------------------------------------------------------------
            //                              Physic engine
            // -----------------------------------------------------------------------
            // Activating the basic physic engine 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);


            // -----------------------------------------------------------------------
            //                          Generating entities
            // -----------------------------------------------------------------------
            // TENTATIVE CODE SNIPPET
            for (var i = 0; i >= 0; i--) {
                this.entityManager.add("hurricane");
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

            // Rendering the Selector
            this.userPointer.update();

            // Scrolling wiht cursors
            this.UserKeyboard.update();

            this.game.time.advancedTiming = true;
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");  
        }

    };

  return Game;
});
