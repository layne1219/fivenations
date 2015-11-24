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
        this.effects = [];
        this.game = game;

        sprite.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(sprite, Phaser.Physics.ARCADE);

        sprite.x = ns.util.rnd(0, 0);
        sprite.y = ns.util.rnd(0, 0);
        // Not equal to the properties can be found in Sprite.body since 
        // using custom logic for providing RTS like unit movements (drifting)
        sprite.angularVelocity = 200;

        sprite.velocity = 0;
        sprite.drag = 200;
        sprite.acceleration = 0;

        sprite.maxVelocity = 250;
        sprite.maxAcceleration = 250;
        sprite.maxDrag = 250;
        sprite.maxTargetDragTreshold = 200;

        // velocity limit for both coordinates
        sprite.body.maxVelocity.set(sprite.maxVelocity);
        //  Tell it we don't want physics to manage the rotation
        sprite.body.allowRotation = false;

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

        resetEffects: function(){
            for (var i = this.effects.length - 1; i >= 0; i--) {
                this.effects[i] = null;
            }
            this.effects = [];
        },

        removeEffect: function(effect){
            if ("function" !== effect){
                return false;
            }
            for (var i = this.effects.length - 1; i >= 0; i--) {
                if (effect === this.effects[i][0]){
                    this.effects.splice(i, 1);
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
            if ("function" !== typeof effect){
                return false;
            }
            return true;
        },

        updateEffects: function(){
            // invoking the first effect until it returns false when removing it and going on
            while(this.effects[0]){
                if (!this.effects[0][0].apply(this, this.effects[0].slice(1))){
                    this.effects.splice(0, 1);
                } else {
                    return false;
                }
            }
        },

        moveTo: function(targetX, targetY){
            var x = this.sprite.x,
                y = this.sprite.y,
                distance = Phaser.Math.distance(x, y, targetX, targetY);

            this.sprite.targetX = targetX;
            this.sprite.targetY = targetY;
            this.sprite.targetInitialDistance = distance;
            this.sprite.targetAngle = Math.atan2(targetY - y, targetX - x);
            this.sprite.originX = x;
            this.sprite.originY = y;
            this.sprite.targetDragTreshold = Math.min(this.sprite.maxTargetDragTreshold, distance / 2);

            this.resetEffects();
            this.addEffect(this.accelerateToTarget);
            this.addEffect(this.moveToTarget);
            this.addEffect(this.stopping);
            this.addEffect(this.resetMovement);

            this.setMovementState(MOVEMENT_WAITING);
       },

       stop: function(){
            this.resetEffects();
            this.addEffect(this.stopping);
            this.addEffect(this.resetMovement);
            this.setMovementState(MOVEMENT_WAITING);
       },

        /**
        * Move the given display object towards the x/y coordinates at a steady velocity.
        * If you specify a easeInOutThreshold then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.
        * Timings are approximate due to the way browser timers work. Allow for a variance of +- 50ms.
        * Note: The display object does not continuously track the target. If the target changes location during transit the display object will not modify its course.
        * Note: The display object doesn't stop moving once it reaches the destination coordinates.
        * Note: Doesn't take into account acceleration, maxVelocity or drag (if you've set drag or acceleration too high this object may not move at all)
        *
        * @return {boolean} returning false when the effect is no longer must be applied on the entity
        */
        moveToTarget: function () {

            this.sprite.acceleration = 0;

            this.updateMovementHelpers();
            this.updateVelocity();
            this.setMovementState(MOVEMENT_MOVING);

            return this.sprite.distance > this.sprite.targetDragTreshold;
        },     

        accelerateToTarget: function(){
            
            this.sprite.acceleration = this.sprite.maxAcceleration;

            this.updateMovementHelpers();
            this.updateVelocity();
            this.setMovementState(MOVEMENT_ACCELERATING);

            return this.sprite.distanceInverse < this.sprite.targetDragTreshold && this.sprite.velocity < this.sprite.maxVelocity;
        },

        stopping: function(){

            this.sprite.acceleration = -this.sprite.maxAcceleration;
            
            this.updateMovementHelpers();
            this.updateVelocity();
            this.setMovementState(MOVEMENT_DECCELERATING);

            return this.sprite.distance > 0 && this.sprite.distanceFromOrigin < this.sprite.targetInitialDistance && this.sprite.velocity > 0;            
        },        

        resetMovement: function(){

            this.sprite.acceleration = 0;
            this.sprite.velocity = 0;

            this.updateVelocity();
            this.setMovementState(MOVEMENT_STOPPED);

            return false;
        },

        /**
        * Updating all the helper variables that take place in calculating the appropriate motions
        * according to the current effects applied on the Entity
        *
        * @return {void} 
        */
        updateMovementHelpers: function(){
            this.sprite.distance = this.game.physics.arcade.distanceToXY(this.sprite, this.sprite.targetX, this.sprite.targetY),
            this.sprite.distanceInverse = this.sprite.targetInitialDistance - this.sprite.distance,
            this.sprite.distanceFromOrigin = this.game.physics.arcade.distanceToXY(this.sprite, this.sprite.originX, this.sprite.originY);
            this.sprite.targetAngle = Math.atan2(this.sprite.targetY - this.sprite.y, this.sprite.targetX - this.sprite.x);
        },

        /**
        * Updating the velocity according to the applied effects altering the coordinates of the Entity
        *
        * @param {number} angle - rotation toward the target in radian
        * @param {number} speed - speed factor going from 0 to 1 where 1 means the entity will be going with max speed
        * @return {void} 
        */
        updateVelocity: function(){
            
            if (this.sprite.acceleration){
                this.sprite.velocity += this.sprite.acceleration * this.game.time.physicsElapsed;
            }
            else if (this.sprite.drag){
                this.sprite.drag *= this.game.time.physicsElapsed;
                if (this.sprite.velocity - this.sprite.drag > 0){
                    this.sprite.velocity -= this.sprite.drag;
                }
                else if (this.sprite.velocity + this.sprite.drag < 0){
                    this.sprite.velocity += this.sprite.drag;
                }
                else {
                    this.sprite.velocity = 0;
                }
            }

            if (this.sprite.velocity > this.sprite.maxVelocity){
                this.sprite.velocity = this.sprite.maxVelocity;
            } else if (this.sprite.velocity < -this.sprite.maxVelocity){
                this.sprite.velocity = -this.sprite.maxVelocity;
            }            

            this.sprite.body.velocity.x = Math.cos(this.sprite.targetAngle) * this.sprite.velocity;
            this.sprite.body.velocity.y = Math.sin(this.sprite.targetAngle) * this.sprite.velocity;        
        },     

        setMovementState: function(state){
            this.state.movement = state;
        },    

        getSprite: function(){
            return this.sprite;
        },

        update: function(){

            this.updateEffects();

            console.log(this.state.movement);

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
            for (var i = 0, sprite, entity; i >= 0; i--) {
                sprite = this.game.add.sprite(0, 0, 'test-ship');

                entity = new Entity(this.game, sprite);
                entity.moveTo(ns.util.rnd(0, 640), ns.util.rnd(0, 480));
                objects.push(entity);
                
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
