define("Game", ["Map"], function(Map) {
    'use strict';

    var cursors;

    function Game() {}

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

            // Activating the basic physic engine 
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // TENTATIVE CODE SNIPPET
            for (var i = 25, sprite; i >= 0; i--) {
                sprite = this.game.add.sprite(0, 0, 'test-ship');
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                sprite.x = window.fivenations.util.rnd(0, 640);
                sprite.y = window.fivenations.util.rnd(0, 480);
                sprite.body.velocity.x = 1;
                sprite.body.velocity.y = 1;            
                sprite.body.acceleration.x = window.fivenations.util.rnd(0, 100);
                sprite.body.acceleration.y = window.fivenations.util.rnd(0, 100);            
                sprite.body.maxVelocity.x = 500;
                sprite.body.maxVelocity.y = 500;
            };

            
        },

        update: function () {

            // Manual Srolling
            scrollWithCursor.call(this);

            // Rendering the map
            this.map.update();
        }

    };

  return Game;
});
