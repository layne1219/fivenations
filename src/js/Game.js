define('Game', ['Map', 'EntityManager', 'UserPointer'], function(Map, EntityManager, UserPointer) {
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

            // Generate a Map
            this.map = new Map();
            this.map.append(this.game);

            // Set up the EntityManager
            EntityManager.setGame(this.game);
            this.entityManger = EntityManager.getInstance();

            // Set up User pointer
            UserPointer.setGame(this.game);
            this.userPointer = UserPointer.getInstance();
            this.userPointer.on('mousedown', (function(){
                this.entityManger
                    .get(0)
                    .moveTo(this.game.camera.x + this.game.input.mousePointer.x, this.game.camera.y + this.game.input.mousePointer.y); 
            }).bind(this));

            // Activating the basic physic engine 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // TENTATIVE CODE SNIPPET
            for (var i = 0; i >= 0; i--) {
                this.entityManger.add(1);
            }
            
        },

        update: function () {

            // Manual Srolling
            scrollWithCursor.call(this);

            // Rendering the map
            this.map.update();

            // Rendering the units
            this.entityManger.get().forEach(function(entity){
                entity.update();
            });

        }

    };

  return Game;
});
