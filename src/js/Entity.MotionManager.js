define('Entity.MotionManager', ['Util'], function(Util) {

    /**
     * Constructor function to initialise the MotionManager
     * @param {[object]} entity [The target entity whose coordinates will be altered by the applied effects]
     */
    function MotionManager(entity) {
        var dataObject = entity.getDataObject();

        this.game = entity.game;

        this.dispatcher = new Util.EventDispatcher();

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

        this.isEntityArrivedAtDestination = false;

    }

    MotionManager.prototype = {

        /**
         * Make the entity move from its current position to the target coords. The operation also 
         * calculates all the required helper variables including the rotoation.
         * @param  {[integer]} targetX [X coordinate of the target location]
         * @param  {[integer]} targetY [Y coordinate of the target location]
         * @return {[void]}
         */
        moveTo: function(targetX, targetY) {
            var x = this.sprite.x,
                y = this.sprite.y,
                distance = Phaser.Math.distance(x, y, targetX, targetY),
                rotationOffset = Math.floor(this.rotation.maxAngleCount * 0.75);

            this.movement.targetX = targetX;
            this.movement.targetY = targetY;
            this.movement.targetInitialDistance = distance;

            this.rotation.calculatedAngle = Phaser.Math.radToDeg(Math.atan2(targetY - y, targetX - x));
            if (this.rotation.calculatedAngle < 0) {
                this.rotation.calculatedAngle = 360 - Math.abs(this.rotation.calculatedAngle);
            }
            this.rotation.targetConsolidatedAngle = (Math.floor(this.rotation.calculatedAngle / (360 / this.rotation.maxAngleCount)) + rotationOffset) % this.rotation.maxAngleCount;

            this.rotation.stepNumberToRight = Util.calculateStepTo(this.rotation.currentConsolidatedAngle, this.rotation.targetConsolidatedAngle, this.rotation.maxAngleCount, 1);
            this.rotation.stepNumberToLeft = Util.calculateStepTo(this.rotation.currentConsolidatedAngle, this.rotation.targetConsolidatedAngle, this.rotation.maxAngleCount, -1);

            this.movement.originX = x;
            this.movement.originY = y;
            this.movement.targetDragTreshold = Math.min(this.movement.maxTargetDragTreshold, distance / 2);

            this.isEntityArrivedAtDestination = false;

            this.resetEffects();
            if (this.movement.velocity > 0 && this.rotation.currentConsolidatedAngle !== this.rotation.targetConsolidatedAngle && this.entity.hasSlowManeuverability()) {
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
        stop: function() {
            this.resetEffects();
            this.addEffect(this.stopping);
            this.addEffect(this.resetMovement);
        },

        /**
         * Tick function for altering the helper variables that determines the effects
         * influence the entity object 
         * @return {[void]}
         */
        update: function() {

            // updating all the helper values to alter the entity properties which take part in the movements 
            this.updateVelocity();
            this.updateRotation();
            // this should be the last invoked function here
            this.updateEffects();

        },

        /**
         * Updating the velocity according to the applied effects that can alter the coordinates of the Entity
         *
         * @return {void} 
         */
        updateVelocity: function() {

            this.movement.distance = this.game.physics.arcade.distanceToXY(this.sprite, this.movement.targetX, this.movement.targetY);
            this.movement.distanceInverse = this.movement.targetInitialDistance - this.movement.distance;
            this.movement.distanceFromOrigin = this.game.physics.arcade.distanceToXY(this.sprite, this.movement.originX, this.movement.originY);

            if (this.movement.acceleration) {
                this.movement.velocity += this.movement.acceleration * this.game.time.physicsElapsed;
            } else if (this.movement.drag) {
                this.movement.drag *= this.game.time.physicsElapsed;
                if (this.movement.velocity - this.movement.drag > 0) {
                    this.movement.velocity -= this.movement.drag;
                } else if (this.movement.velocity + this.movement.drag < 0) {
                    this.movement.velocity += this.movement.drag;
                } else {
                    this.movement.velocity = 0;
                }
            }

            if (this.movement.velocity > this.movement.maxVelocity) {
                this.movement.velocity = this.movement.maxVelocity;
            } else if (this.movement.velocity < -this.movement.maxVelocity) {
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
        updateRotation: function() {

            if (this.movement.velocity > 0 && this.entity.hasSlowManeuverability()) {
                return;
            }

            if (this.rotation.currentConsolidatedAngle === this.rotation.targetConsolidatedAngle) {
                return;
            }

            this.movement.targetAngle = Math.atan2(this.movement.targetY - this.sprite.y, this.movement.targetX - this.sprite.x);
            this.rotation.angularDirection = this.rotation.stepNumberToLeft < this.rotation.stepNumberToRight ? -1 : 1;

            this.rotation.angularVelocityHelper += this.rotation.angularVelocity * this.game.time.physicsElapsed;
            if (this.rotation.angularVelocityHelper > 1) {
                this.rotation.angularVelocityHelper = 0;
                if (this.rotation.currentConsolidatedAngle + this.rotation.angularDirection < 0) {
                    this.rotation.currentConsolidatedAngle = this.rotation.maxAngleCount;
                }
                this.rotation.currentConsolidatedAngle += this.rotation.angularDirection;
                this.rotation.currentConsolidatedAngle %= this.rotation.maxAngleCount;
            }

            // set the frame of the sprite according to the calculated angularRotation
            this.sprite.frame = this.rotation.currentConsolidatedAngle * this.rotation.framePadding;
        },

        /**
         * Invoking the currently selected effect from the effect queue at every tick
         * @return {[void]}
         */
        updateEffects: function() {
            // invoking the first effect as long as it returns true
            // then remove ti  
            while (this.effects[0]) {
                if (!this.effects[0][0].apply(this, this.effects[0].slice(1))) {
                    this.effects.splice(0, 1);
                } else {
                    return false;
                }
            }
        },

        /**
         * Pushing a new effect to the effect queue
         * @param {[function]} effect [function that will be triggered at every tick when selected]
         */
        addEffect: function(effect) {
            var params = Array.prototype.slice(arguments, 1);
            if ('function' !== typeof effect) {
                return false;
            }
            this.effects.push([effect].concat(params));
        },

        /**
         * Reseting the effect queue by removing all the effects from the queue
         * @return {[void]}
         */
        resetEffects: function() {
            for (var i = this.effects.length - 1; i >= 0; i -= 1) {
                this.effects[i] = null;
                this.effects.splice(i, 1);
            }
            this.effects = [];
        },

        /**
         * Removing the given function from the effect queue 
         * @param  {[function]} effect []
         * @return {[void]}}
         */
        removeEffect: function(effect) {
            if ('function' !== effect) {
                return false;
            }
            for (var i = this.effects.length - 1; i >= 0; i -= 1) {
                if (effect === this.effects[i][0]) {
                    this.effects.splice(i, 1);
                }
            }
        },

        /**
         * Move the given entity object towards the x/y coordinates at a steady velocity.
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        moveToTarget: function() {

            this.movement.acceleration = 0;
            if (this.movement.distance > this.movement.targetDragTreshold){
                return true;
            } else {
                this.isEntityArrivedAtDestination = true;
                return false;
            }
            
        },

        /**
         * Move the given entity towards the target coordinates with an increasing velocity
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        accelerateToTarget: function() {

            this.movement.acceleration = this.movement.maxAcceleration;
            return this.movement.distanceInverse < this.movement.targetDragTreshold && this.movement.velocity < this.movement.maxVelocity;
        },

        /**
         * Making the given entity stop with a certain amount of drag
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        stopping: function() {

            this.movement.acceleration = -this.movement.maxAcceleration;
            if (this.movement.distance > 0 && this.movement.distanceFromOrigin < this.movement.targetInitialDistance && this.movement.velocity > 0){
                return true;
            } else {
                if (this.isEntityArrivedAtDestination){
                    this.dispatcher.dispatch('arrive');
                }
                return false;
            }

        },

        /**
         * Reset all the helper variables influencing the given entity so that further effects 
         * can be applied on the entitiy
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        resetMovement: function() {

            this.movement.acceleration = 0;
            this.movement.velocity = 0;
            this.rotation.angularVelocity = 0;

            return false;
        },

        /**
         * Altering the rotation of the given entity to face towards the target coordinats 
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        rotateToTarget: function() {

            // if the entity is already accrelerating than it doesn't have to stop for rotating
            if (this.movement.velocity > 0) {
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
         * Registers a callback to the given event
         * @param  {string} event
         * @param  {Function} callback 
         * @return {void}            
         */
        on: function(event, callback) {
            this.dispatcher.addEventListener(event, callback);
        },

        /**
         * Registers a callback to the given event that will be called only once
         * @param  {string} event
         * @param  {Function} callback 
         * @return {void}            
         */
        once: function(event, callback) {
            var once;
            if (typeof callback !== 'function') {
                return;
            }
            once = function(){
                callback();
                this.dispatcher.removeEventListener(event, once);
            }.bind(this);
            this.dispatcher.addEventListener(event, once);
        }
    };

    return MotionManager;

});