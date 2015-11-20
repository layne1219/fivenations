define("Game", ["Map"], function(Map) {
    'use strict';

    var ns = window.fivenations,
        game,
        cursors, 
        objects = [];

    function Entity(game, sprite){
        this.game = game;
        this.sprite = sprite;
        this.effects = [];
    }

    Entity.prototype = {

        addEffect: function(effect){
            var params = Array.prototype.slice(arguments, 1);
            if (!this.isEffectApplicable(effect)){
                return false;
            }
            this.effects.push([effect].concat(params));
        },

        removeEffect: function(effect){
            if ("function" !== effect){
                return false;
            }
            for (var i = this.effects.length - 1; i >= 0; i--) {
                if (effect === this.effects[i][0]){
                    array.splice(i, 1);
                }
            }
        },

        isEffectApplicable: function(effect){
            // cycling through the set of effects being applied at the time of the invokation 
            for (var i = this.effects.length - 1; i >= 0; i--) {
                if (effect === this.effects[i][0]){
                    return false;
                }
            }
            // Determining whether or not it's a valid function
            if ("function" !== effect){
                return false;
            }
            return true;
        },

        updateEffects: function(){
            for (var i = this.effects.length - 1; i >= 0; i--) {
                this.effects[i][0].apply(this, this.effects[i].slice(1));
            }
        },

        moveTo: function(targetX, targetY){
            var x = this.sprite.x,
                y = this.sprite.y;

            this.sprite.targetX = targetX;
            this.sprite.targetY = targetY;
            this.sprite.targetInitialDistance = Phaser.Math.distance(x, y, targetX, targetY);
            this.sprite.targetInitialDistanceX = Math.abs(x - targetX);
            this.sprite.targetInitialDistanceY = Math.abs(y - targetY);
            this.sprite.rotation = this.game.physics.arcade.angleToXY(this.sprite, targetX, targetY);

        },

        moveToTarget: function(){
            var distanceX = Math.abs(this.sprite.x - this.sprite.targetX),
                distanceY = Math.abs(this.sprite.y - this.sprite.targetY),
                currentDistance = Phaser.Math.distance(this.sprite.x, this.sprite.y, this.sprite.targetX, this.sprite.targetY),
                velocityX = this.sprite.body.maxVelocity.x,
                velocityY = this.sprite.body.maxVelocity.y,
                easeInOutThreshold = 50,
                easeInOutprogress;

            // easing on the horizontal axis
            /*if (this.sprite.targetInitialDistanceX - distanceX < easeInOutThreshold){
                easeInOutprogress = Math.max(1, this.sprite.targetInitialDistanceX - distanceX) / easeInOutThreshold;
                velocityX = this.sprite.body.maxVelocity.x * easeInOutprogress;
            } else if (distanceX < easeInOutThreshold){
                velocityX = Math.min(distanceX, this.sprite.body.maxVelocity.x);
            }

            // easing on the vertical axis 
            if (this.sprite.targetInitialDistanceY - distanceY < easeInOutThreshold){
                easeInOutprogress = Math.max(1, this.sprite.targetInitialDistanceX - distanceX) / easeInOutThreshold;
                velocityY = this.sprite.body.maxVelocity.y * easeInOutprogress;
            } else if (distanceY < easeInOutThreshold){
                velocityY = Math.min(distanceY, this.sprite.body.maxVelocity.y);
            } */

            //this.sprite.rotation = this.game.physics.arcade.angleToXY(this.sprite, this.sprite.targetX, this.sprite.targetY);

            if (currentDistance > 50){
                this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 500, this.sprite.body.acceleration);
            } else {
                this.sprite.body.acceleration.set(0);
            }

            console.log(currentDistance);
        },

        getSprite: function(){
            return this.sprite;
        },

        update: function(){
            this.moveToTarget();
        }

    };

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
            for (var i = 0, sprite; i >= 0; i--) {
                sprite = this.game.add.sprite(0, 0, 'test-ship');
                sprite.anchor.set(0.5);
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                sprite.x = window.fivenations.util.rnd(0, 0);
                sprite.y = window.fivenations.util.rnd(0, 0);                    
                sprite.body.drag.set(250);
                sprite.body.maxVelocity.set(200);
                objects.push(new Entity(this.game, sprite));
            }

            
            objects[0].moveTo(200,200);
            
            
        },

        update: function () {

            // Manual Srolling
            scrollWithCursor.call(this);

            // Rendering the map
            this.map.update();

            // TEST CODE
            objects.forEach(function(object){
                object.update();            
            });

        }

    };

  return Game;
});
