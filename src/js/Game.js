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
        sprite;

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
            sprite = this.game.add.sprite(20, 20, 'gui');        

            // -----------------------------------------------------------------------
            //                              UserPointer
            // -----------------------------------------------------------------------
            // Set up User pointer
            UserPointer.setGame(this.game);
            this.userPointer = UserPointer.getInstance();

            // Right Mouse Button to send units to a position
            this.userPointer.on('rightmousedown', (function(){

                var camera = this.game.camera,
                    mousePointer = this.game.input.mousePointer;

                this.entityManager
                    .getAllSelected().forEach(function(entity){
                        entity.moveTo(camera.x + mousePointer.x, camera.y + mousePointer.y); 
                    });
                    
            }).bind(this));

            // Unselecting units when clicking over an area with no entities underneath
            this.userPointer.on('leftmousedown', (function(){

                if (this.entityManager.getAllHover().length === 0){
                    this.entityManager.unselectAll();
                }

                sprite.frame = 101;
                console.log(sprite.frame);      
                
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

        }

    };

  return Game;
});
