define('Entity.MotionManager', function(){

	function MotionManager(game, entity){
		var dataObject = entity.getDataObject();

		this.game = game;

		this.entity = entity;
		this.sprite = entity.getSprite();
		this.effects = [];

        // Not equal to the properties can be found in Sprite.body since 
        // using custom logic for providing RTS like unit movements (drifting)
        this.movement = {
            velocity: 0,
            acceleration: 0,
            maxVelocity: dataObject.getSpeed(),
            maxAcceleration: dataObject.getSpeed(),
            maxTargetDragTreshold: dataObject.getSpeed()
        };

        // Properties to store angular rotation and spinning informations
        this.rotation = {
            targetConsolidatedAngle: 0,
            currentConsolidatedAngle: 0,
            maxAngleCount: dataObject.getDirections(),
            angularVelocity: 0,
            angularVelocityHelper: 0,
            maxAngularVelocity: dataObject.getManeuverability(),
            framePadding: (dataObject.getAnimType().length && (dataObject.getAnimType().length + 1)) || 1
        };

	}

	MotionManager.prototype = {

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
            if ('function' !== effect){
                return false;
            }
            for (var i = this.effects.length - 1; i >= 0; i--) {
                if (effect === this.effects[i][0]){
                    this.effects.splice(i, 1);
                }
            }
        },

        isEffectApplicable: function(effect){
            // Determining whether or not it's a valid function
            if ('function' !== typeof effect){
                return false;
            }
            return true;
        },

        updateEffects: function(){
            // invoking the first effect as long as it returns false 
            while(this.effects[0]){
                if (!this.effects[0][0].apply(this, this.effects[0].slice(1))){
                    this.effects.splice(0, 1);
                } else {
                    return false;
                }
            }
        },

        /**
         * Make the entity fly from its current position to the passed targets. The operation also 
         * calculates all the required helper variables including the rotoation.
         * @param  {[integer]} targetX [X coordinate of the target location]
         * @param  {[integer]} targetY [Y coordinate of the target location]
         * @return {[void]}
         */
        moveTo: function(targetX, targetY){
            var x = this.sprite.x,
                y = this.sprite.y,
                distance = Phaser.Math.distance(x, y, targetX, targetY),
                rotationOffset = Math.floor(this.rotation.maxAngleCount * 0.75);

            this.movement.targetX = targetX;
            this.movement.targetY = targetY;
            this.movement.targetInitialDistance = distance;
            
            this.rotation.calculatedAngle = Phaser.Math.radToDeg(Math.atan2(targetY - y, targetX - x));
            if (this.rotation.calculatedAngle < 0){
            	this.rotation.calculatedAngle = 360 - Math.abs(this.rotation.calculatedAngle);
            }
            this.rotation.angularVelocityHelper = 0;
            this.rotation.targetConsolidatedAngle = (Math.floor(this.rotation.calculatedAngle / (360 / this.rotation.maxAngleCount)) + rotationOffset) % this.rotation.maxAngleCount;            

        	this.rotation.stepNumberToRight = Util.calculateStepTo(this.rotation.currentConsolidatedAngle, this.rotation.targetConsolidatedAngle, this.rotation.maxAngleCount, 1);
        	this.rotation.stepNumberToLeft = Util.calculateStepTo(this.rotation.currentConsolidatedAngle, this.rotation.targetConsolidatedAngle, this.rotation.maxAngleCount, -1);

            this.movement.originX = x;
            this.movement.originY = y;
            this.movement.targetDragTreshold = Math.min(this.movement.maxTargetDragTreshold, distance / 2);

            this.resetEffects();
            if (this.movement.velocity > 0 && this.hasSlowManeuverability()){
                this.addEffect(this.stopping);
                this.addEffect(this.resetMovement);
            }
            this.addEffect(this.rotateToTarget);
            this.addEffect(this.accelerateToTarget);
            this.addEffect(this.moveToTarget);
            this.addEffect(this.stopping);
            this.addEffect(this.resetMovement);

       },

       /**
        * Terminate the entity from any further movement by applying a suitable drag on it
        * @return {[void]}
        */
       stop: function(){
            this.resetEffects();
            this.addEffect(this.stopping);
            this.addEffect(this.resetMovement);
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
            return this.movement.distance > this.movement.targetDragTreshold;
        },     

        accelerateToTarget: function(){
            
            this.movement.acceleration = this.movement.maxAcceleration;
            return this.movement.distanceInverse < this.movement.targetDragTreshold && this.movement.velocity < this.movement.maxVelocity;
        },

        stopping: function(){

            this.movement.acceleration = -this.movement.maxAcceleration;
            return this.movement.distance > 0 && this.movement.distanceFromOrigin < this.movement.targetInitialDistance && this.movement.velocity > 0;            
        
        }, 

        resetMovement: function(){

            this.movement.acceleration = 0;
            this.movement.velocity = 0;           
            this.rotation.angularVelocity = 0;

            this.eventDispatcher.dispatch('stop', this);

            return false;
        },

        rotateToTarget: function(){

        	// if the entity is already accrelerating than it doesn't have to stop for rotating
        	if (this.movement.velocity > 0){
        		// it also can rotate with a lot higher speed to mimic flying units in Blizzard's Starcraft
        		this.rotation.angularVelocity = this.rotation.maxAngularVelocity * 1.5;
        		// jumping to the next effect
        		return false;
        	}

        	// rotating with default speed until the entity arrives at the target angle 
        	this.rotation.angularVelocity = this.rotation.maxAngularVelocity;
        	return this.rotation.currentConsolidatedAngle !== this.rotation.targetConsolidatedAngle;
        },

        /**
        * Updating the velocity according to the applied effects that can alter the coordinates of the Entity
        *
        * @return {void} 
        */
		updateVelocity: function(){

            this.movement.distance = this.game.physics.arcade.distanceToXY(this.sprite, this.movement.targetX, this.movement.targetY);
            this.movement.distanceInverse = this.movement.targetInitialDistance - this.movement.distance;
            this.movement.distanceFromOrigin = this.game.physics.arcade.distanceToXY(this.sprite, this.movement.originX, this.movement.originY);
            
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

        /**
        * Updating the sprite's current frame according to the rotation details
        *
        * @return {void} 
        */
        updateRotation: function(){

            if (this.movement.velocity > 0 && this.entity.hasSlowManeuverability()){
                return;
            }

        	if (this.rotation.currentConsolidatedAngle === this.rotation.targetConsolidatedAngle){
        		return;
        	}

            this.movement.targetAngle = Math.atan2(this.movement.targetY - this.sprite.y, this.movement.targetX - this.sprite.x);            
        	this.rotation.angularDirection = this.rotation.stepNumberToLeft < this.rotation.stepNumberToRight ? -1 : 1;

        	this.rotation.angularVelocityHelper += this.rotation.angularVelocity * this.game.time.physicsElapsed;
        	if (this.rotation.angularVelocityHelper > 1){
        		this.rotation.angularVelocityHelper = 0;
        		if (this.rotation.currentConsolidatedAngle + this.rotation.angularDirection < 0){
        			this.rotation.currentConsolidatedAngle = this.rotation.maxAngleCount;
        		}
        		this.rotation.currentConsolidatedAngle += this.rotation.angularDirection;
        		this.rotation.currentConsolidatedAngle %= this.rotation.maxAngleCount;
        	}

        	// set the frame of the sprite according to the calculated angularRotation
        	this.sprite.frame = this.rotation.currentConsolidatedAngle * this.rotation.framePadding;
        }
	};

	return MotionManager;

});