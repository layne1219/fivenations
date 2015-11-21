define("Game", ["Map"], function(Map) {
    'use strict';

    var ns = window.fivenations,
        game,
        cursors, 
        objects = [];


    var MOVEMENT_STOPPED = 0,
        MOVEMENT_WAITING = 1,
        MOVEMENT_MOVING = 2,
        MOVEMENT_ACCELERATING = 3,
        MOVEMENT_DECCELERATING = 4;

    function Entity(game, sprite){

        this.game = game;
        this.sprite = sprite;
        this.state = {
            movement: MOVEMENT_STOPPED
        };
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
            this.sprite.originX = x;
            this.sprite.originY = y;

            this.state.movement = MOVEMENT_WAITING;
       },

        /**
        * Move the given display object towards the x/y coordinates at a steady velocity.
        * If you specify a easeInOutThreshold then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
        * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
        * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
        * Note: The display object doesn't stop moving once it reaches the destination coordinates.
        * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
        *
        * @method Phaser.Physics.Arcade#moveToXY
        * @param {any} displayObject - The display object to move.
        * @param {number} x - The x coordinate to move towards.
        * @param {number} y - The y coordinate to move towards.
        * @param {number} acceleration - The y coordinate to move towards.
        * @param {number} [easeInOutThreshold=0] - Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the object will arrive at destination in the given number of ms.
        * @return {number} The angle (in radians) that the object should be visually set to in order to match its new velocity.
        */
        moveToTarget: function () {

            var arcade = this.game.physics.arcade,
                distance = arcade.distanceToXY(this.sprite, this.sprite.targetX, this.sprite.targetY),
                distanceInverse = this.sprite.targetInitialDistance - distance,
                angle = Math.atan2(this.sprite.targetY - this.sprite.y, this.sprite.targetX - this.sprite.x); 

            this.sprite.body.velocity.x = Math.cos(angle) * this.sprite.body.maxVelocity.x;
            this.sprite.body.velocity.y = Math.sin(angle) * this.sprite.body.maxVelocity.y;

            this.state.movement = MOVEMENT_MOVING;

            return distance > this.sprite.drag;

        },

        accelerateToTarget: function(){

            var distance = this.game.physics.arcade.distanceToXY(this.sprite, this.sprite.targetX, this.sprite.targetY),
                distanceInverse = this.sprite.targetInitialDistance - distance,
                angle = Math.atan2(this.sprite.targetY - this.sprite.y, this.sprite.targetX - this.sprite.x),
                speed = Math.min(1, (distanceInverse / this.sprite.drag) + (this.sprite.acceleration / 1000));          

            this.state.movement = MOVEMENT_ACCELERATING;
           
            this.sprite.body.velocity.x = Math.cos(angle) * this.sprite.body.maxVelocity.x * speed;
            this.sprite.body.velocity.y = Math.sin(angle) * this.sprite.body.maxVelocity.y * speed;

            return distanceInverse > this.sprite.drag;
        },

        dragToTarget: function(){

            var distance = this.game.physics.arcade.distanceToXY(this.sprite, this.sprite.targetX, this.sprite.targetY),
                angle = Math.atan2(this.sprite.targetY - this.sprite.y, this.sprite.targetX - this.sprite.x),
                speed = distance / this.sprite.drag;

            this.state.movement = MOVEMENT_DECCELERATING;

            this.sprite.body.velocity.x = Math.cos(angle) * this.sprite.body.maxVelocity.x * speed;
            this.sprite.body.velocity.y = Math.sin(angle) * this.sprite.body.maxVelocity.y * speed;

            return distance > this.sprite.drag;            
        },

        stop: function(){
            this.state.movement = MOVEMENT_STOPPED;
        },

        updateMovement: function(){
            var distance = this.game.physics.arcade.distanceToXY(this.sprite, this.sprite.targetX, this.sprite.targetY),
                distanceInverse = this.sprite.targetInitialDistance - distance,
                distanceFromOrigin = this.game.physics.arcade.distanceToXY(this.sprite, this.sprite.originX, this.sprite.originY);

            // If the distance is less then a fixed threshold - or - the object has overdrifted
            if (this.state.movement !== MOVEMENT_STOPPED){   
                if (distance <= 1 || distanceFromOrigin >= this.sprite.targetInitialDistance){
                    this.stop();  
                } else if (distance < this.sprite.drag){
                    this.dragToTarget();
                } else if (distanceInverse < this.sprite.drag){ 
                    this.accelerateToTarget();
                } else {
                    this.moveToTarget();
                }
            }

            console.log(this.state.movement);

        },

        updateMovementState: function(){



        },

        getSprite: function(){
            return this.sprite;
        },

        update: function(){

            this.updateMovement();

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
                sprite.anchor.setTo(0.5, 0.5);

                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);

                sprite.x = ns.util.rnd(0, 0);
                sprite.y = ns.util.rnd(0, 0);
                // Not equal to the properties can be found in Sprite.body since 
                // using custom logic for providing RTS like unit movements (drifting)
                sprite.acceleration = 200;
                sprite.drag = 100;

                // velocity limit for both coordinates
                sprite.body.maxVelocity.set(250);
                //  Tell it we don't want physics to manage the rotation
                sprite.body.allowRotation = false;

                objects.push(new Entity(this.game, sprite));
            }
            
                   
            
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

            if (this.game.input.activePointer.isDown){
                objects[0].moveTo(this.game.camera.x + this.game.input.mousePointer.x, this.game.camera.y + this.game.input.mousePointer.y); 
            }
        }

    };

  return Game;
});
