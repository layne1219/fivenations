define('Game', [
    'Map', 
    'EntityManager', 
    'UserPointer', 
    'UserKeyboard', 
    'Util'
], function(Map, EntityManager, UserPointer, UserKeyboard, Util) {
    'use strict';

    var ns = window.fivenations,
        cursors;

    function scrollWithCursor(){
        if (cursors.up.isDown){
            this.game.camera.y -= 4;
        }
        else if (cursors.down.isDown){
            this.game.camera.y += 4;
        }

        if (cursors.left.isDown){
            this.game.camera.x -= 4;
        } else if (cursors.right.isDown){
            this.game.camera.x += 4;
        }        
    }

    function Game() {}    

    Game.prototype = {

        preloader: function(){

        },

        create: function () {

            // preventing the context menu to appear when the user clicks with the right mouse button
            this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

            // handling the curser key events
            cursors = this.game.input.keyboard.createCursorKeys();

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


            // Activating the basic physic engine 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // TENTATIVE CODE SNIPPET
            for (var i = 10; i >= 0; i--) {
                this.entityManager.add(1);
            }
            this.entityManager.get().forEach(function(entity){
                entity.moveTo(Util.rnd(0, 500), Util.rnd(0, 500));
            });
            
        },

        update: function () {

            // Manual Srolling
            scrollWithCursor.call(this);

            // Rendering the map
            this.map.update();

            // Rendering the units
            this.entityManager.get().forEach(function(entity){
                entity.update();
            });

            // Rendering the Selector
            this.userPointer.update();

        }

    };

  return Game;
});
