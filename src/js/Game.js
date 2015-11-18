define("Game", ["Map"], function(Map) {
    'use strict';

    var ns = window.fivenations,
        cursors, 
        objects = [];

    function Entity(sprite){
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
            this.sprite.targetDistance = Phaser.Math.distance(x, y, targetX, targetY);

        },

        updateMovemenet: function(){
            this.sprite.targetDistanceX = Math.abs(x - targetX);
            this.sprite.targetDistanceY = Math.abs(y - targetY);
        },

        easeInToTarget: function(){
            if (ns.util.between(this.sprite.targetDistanceX, 1, 100)){
                if (this.sprite.x < this.sprite.targetX){
                    this.sprite.body.velocity.x += 25;
                } else if (this.sprite.x > this.sprite.targetX){
                    this.sprite.body.acceleration.x -= -25;
                }
            }
            if (ns.util.between(this.sprite.targetDistanceY, 1, 100)){
                if (this.sprite.y < this.sprite.targetY){
                    this.sprite.body.velocity.y += 25;
                } else if (this.sprite.y > this.sprite.targetY){
                    this.sprite.body.acceleration.y -= -25;
                }
            } 
        },

        moveToTarget: function(){

            if (this.sprite.x < this.sprite.targetX){
                this.sprite.body.velocity.x = this.sprite.body.maxVelocity.x;
            } else if (this.sprite.x > this.sprite.targetX){
                this.sprite.body.acceleration.x = -this.sprite.body.maxVelocity.x;
            }
            if (this.sprite.y < this.sprite.targetY){
                this.sprite.body.acceleration.y = this.sprite.body.maxVelocity.y;
            } else if (this.sprite.y > this.sprite.targetY){
                this.sprite.body.acceleration.y = -this.sprite.body.maxVelocity.y;
            }   
        },

        update: function(){
            
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
                sprite.x = window.fivenations.util.rnd(0, 640);
                sprite.y = window.fivenations.util.rnd(0, 480);                    
                sprite.body.maxVelocity.x = 500;
                sprite.body.maxVelocity.y = 500;
                objects.push(new Entity(sprite));
            }

            objects[0].moveTo(50, 50);
            
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
