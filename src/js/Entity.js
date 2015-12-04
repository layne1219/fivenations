define('Entity', function(){
	
	var 
		// Private constant like values
		MOVEMENT_STOPPED = 0,
        MOVEMENT_WAITING = 1,
        MOVEMENT_MOVING = 2,
        MOVEMENT_ACCELERATING = 3,
        MOVEMENT_DECCELERATING = 4;

	function Entity(entityManager, sprite){

		// retrive the Phaser.Game object
        this.game = entityManager.getGame();

        // unique identifier in order to obtain the very entity
        this.uid = entityManager.getNextId();

        // Container to store the applied effects 
        this.effects = [];

        // Whether the Entity is selected or not 
        this.selected = false;

        // Not equal to the properties can be found in Sprite.body since 
        // using custom logic for providing RTS like unit movements (drifting)
        this.movement = {
            angularVelocity: 200,
            velocity: 0,
            drag: 200,
            acceleration: 0,
            maxVelocity: 250,
            maxAcceleration: 250,
            maxDrag: 250,
            maxTargetDragTreshold: 200,
        };

        // Set up the Phaser.Sprite object
        sprite.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(sprite, Phaser.Physics.ARCADE);

        sprite.x = 0;
        sprite.y = 0;        

        // velocity limit for both coordinates
        sprite.body.maxVelocity.set(this.movement.maxVelocity);
        //  Tell it we don't want physics to manage the rotation
        sprite.body.allowRotation = false;

        this.sprite = sprite;
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

            this.movement.targetX = targetX;
            this.movement.targetY = targetY;
            this.movement.targetInitialDistance = distance;
            this.movement.targetAngle = Math.atan2(targetY - y, targetX - x);
            this.movement.originX = x;
            this.movement.originY = y;
            this.movement.targetDragTreshold = Math.min(this.movement.maxTargetDragTreshold, distance / 2);

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

            this.movement.acceleration = 0;

            this.updateVelocity();
            this.setMovementState(MOVEMENT_MOVING);

            return this.movement.distance > this.movement.targetDragTreshold;
        },     

        accelerateToTarget: function(){
            
            this.movement.acceleration = this.movement.maxAcceleration;

            this.updateVelocity();
            this.setMovementState(MOVEMENT_ACCELERATING);

            return this.movement.distanceInverse < this.movement.targetDragTreshold && this.movement.velocity < this.movement.maxVelocity;
        },

        stopping: function(){

            this.movement.acceleration = -this.movement.maxAcceleration;
            
            this.updateVelocity();
            this.setMovementState(MOVEMENT_DECCELERATING);

            return this.movement.distance > 0 && this.movement.distanceFromOrigin < this.movement.targetInitialDistance && this.movement.velocity > 0;            
        },        

        resetMovement: function(){

            this.movement.acceleration = 0;
            this.movement.velocity = 0;

            this.updateVelocity();
            this.setMovementState(MOVEMENT_STOPPED);

            return false;
        },

        /**
        * Updating the velocity according to the applied effects altering the coordinates of the Entity
        *
        * @param {number} angle - rotation toward the target in radian
        * @param {number} speed - speed factor going from 0 to 1 where 1 means the entity will be going with max speed
        * @return {void} 
        */
        updateVelocity: function(){

            this.movement.distance = this.game.physics.arcade.distanceToXY(this.sprite, this.movement.targetX, this.movement.targetY),
            this.movement.distanceInverse = this.movement.targetInitialDistance - this.movement.distance,
            this.movement.distanceFromOrigin = this.game.physics.arcade.distanceToXY(this.sprite, this.movement.originX, this.movement.originY);
            this.movement.targetAngle = Math.atan2(this.movement.targetY - this.sprite.y, this.movement.targetX - this.sprite.x);            
            
            if (this.movement.acceleration){
                this.movement.velocity += this.movement.acceleration * this.game.time.physicsElapsed;
            }
            else if (this.movement.drag){
                this.movement.drag *= this.game.time.physicsElapsed;
                if (this.movement.velocity - this.movement.drag > 0){
                    this.movement.velocity -= this.movement.drag;
                }
                else if (this.movement.velocity + this.movement.drag < 0){
                    this.movement.velocity += this.movement.drag;
                }
                else {
                    this.movement.velocity = 0;
                }
            }

            if (this.movement.velocity > this.movement.maxVelocity){
                this.movement.velocity = this.movement.maxVelocity;
            } else if (this.movement.velocity < -this.movement.maxVelocity){
                this.movement.velocity = -this.movement.maxVelocity;
            }


            this.sprite.body.velocity.x = Math.cos(this.movement.targetAngle) * this.movement.velocity;
            this.sprite.body.velocity.y = Math.sin(this.movement.targetAngle) * this.movement.velocity;        
        },     

        setMovementState: function(state){
            this.movement.state = state;
        },    

        getSprite: function(){
            return this.sprite;
        },

        getId: function(){
        	return this.uid;
        },

        update: function(){

            this.updateEffects();

        },

        select: function(){
        	this.selected = true;
        },

        unselect: function(){
        	this.selected = false;
        }

        // sprite onInputDown and onInputOut
	}

	return Entity;

});

