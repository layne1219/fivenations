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

            cursors = this.game.input.keyboard.createCursorKeys();

            this.map = new Map();
            this.map.append(this.game);
            
        },

        update: function () {

            scrollWithCursor.call(this);

            this.map.update();
        }

    };

  return Game;
});
