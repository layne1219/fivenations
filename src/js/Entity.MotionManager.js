define('Entity.MotionManager', [
    'Entity.MotionManager.EffectManager',
    'Entity.MotionManager.Effects',
    'Util'
], function(EffectManager, Effects, Util) {

    /**
     * Constructor function to initialise the MotionManager
     * @param {[object]} entity [The target entity whose coordinates will be altered by the applied effects]
     */
    function MotionManager(entity) {
        var dataObject = entity.getDataObject();

        this.game = entity.game;

        this.dispatcher = new Util.EventDispatcher();
        this.effectManager = new EffectManager(this);

        this.entity = entity;
        this.sprite = entity.getSprite();

        this.movement = createMovementObject(dataObject);
        this.rotation = createRotationObject(dataObject);

        this.isEntityArrivedAtDestination = false;
        this.isEntityStoppedAtDestination = false;

    }

    function createMovementObject(dataObject) {
        return {
            velocity: 0,
            acceleration: 0,
            maxVelocity: dataObject.getSpeed(),
            maxAcceleration: dataObject.getSpeed(),
            maxTargetDragTreshold: dataObject.getSpeed()
        };        
    }

    function createRotationObject(dataObject) {
        return {
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

        /**
         * Make the entity move from its current position to the target coords. The operation also 
         * calculates all the required helper variables including the rotoation.
         * @param  {object} activity Reference to the given Activity instance
         * @return {void}
         */
        moveTo: function(activity) {
            var targetCoords, distance, rotationOffset;

            if (!activity) {
                throw 'Invalid Activity instance has been passed!';
            }

            this.activity = activity;

            targetCoords = activity.getCoords();
            distance = Phaser.Math.distance(this.sprite.x, this.sprite.y, targetCoords.x, targetCoords.y);
            rotationOffset = Math.floor(this.rotation.maxAngleCount * 0.75);

            this.movement.originX = this.sprite.x;
            this.movement.originY = this.sprite.y;
            this.movement.targetX = targetCoords.x;
            this.movement.targetY = targetCoords.y;
            this.movement.targetInitialDistance = distance;
            this.movement.targetDragTreshold = Math.min(this.movement.maxTargetDragTreshold, distance / 2);
            this.movement.targetAngle = Math.atan2(this.movement.targetY - this.sprite.y, this.movement.targetX - this.sprite.x);

            if (this.rotation.maxAngleCount === 1) {
                this.movement.currentAngle = this.movement.targetAngle;
                this.rotation.targetConsolidatedAngle = this.rotation.currentConsolidatedAngle = 0;
            } else {
                this.rotation.calculatedAngle = Phaser.Math.radToDeg(Math.atan2(targetCoords.y - this.sprite.y, targetCoords.x - this.sprite.x));
                if (this.rotation.calculatedAngle < 0) {
                    this.rotation.calculatedAngle = 360 - Math.abs(this.rotation.calculatedAngle);
                }
                this.rotation.targetConsolidatedAngle = (Math.floor(this.rotation.calculatedAngle / (360 / this.rotation.maxAngleCount)) + rotationOffset) % this.rotation.maxAngleCount;

                this.rotation.stepNumberToRight = Util.calculateStepTo(this.rotation.currentConsolidatedAngle, this.rotation.targetConsolidatedAngle, this.rotation.maxAngleCount, 1);
                this.rotation.stepNumberToLeft = Util.calculateStepTo(this.rotation.currentConsolidatedAngle, this.rotation.targetConsolidatedAngle, this.rotation.maxAngleCount, -1);
            }

            this.isEntityArrivedAtDestination = false;
            this.isEntityStoppedAtDestination = false;

            this.effectManager.resetEffects();
            if (this.movement.velocity > 0 && this.rotation.currentConsolidatedAngle !== this.rotation.targetConsolidatedAngle && this.entity.hasSlowManeuverability()) {
                this.effectManager.addEffect(Effects.get('stopping'));
                this.effectManager.addEffect(Effects.get('resetMovement'));
            }
            this.effectManager.addEffect(Effects.get('rotateToTarget'));
            this.effectManager.addEffect(Effects.get('accelerateToTarget'));
            this.effectManager.addEffect(Effects.get('moveToTarget'));
            this.effectManager.addEffect(Effects.get('stopping'));
            this.effectManager.addEffect(Effects.get('resetMovement'));

        },

        /**
         * Terminate the entity from any further movement by applying a suitable drag on it
         * @return {[void]}
         */
        stop: function() {
            this.effectManager.resetEffects();
            this.effectManager.addEffect(Effects.get('stopping'));
            this.effectManager.addEffect(Effects.get('resetMovement'));
        },

        /**
         * Tick function for altering the helper variables that determines the effects
         * influence the entity object 
         * @return {[void]}
         */
        update: function() {
            this.updateVelocity();
            this.updateRotation();
            this.effectManager.updateEffects();
            this.executeChecks();
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

            this.sprite.body.velocity.x = Math.cos(this.movement.currentAngle) * this.movement.velocity;
            this.sprite.body.velocity.y = Math.sin(this.movement.currentAngle) * this.movement.velocity;
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

            this.movement.currentAngle = this.movement.targetAngle;
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

            this.sprite.frame = this.rotation.currentConsolidatedAngle * this.rotation.framePadding;

        },

        /**
         * Executes checks after altering the position of the given entity has been ran
         * @return {void}
         */
        executeChecks: function() {
            if (this.isEntityStoppedAtDestination){
                if (this.activity) {
                    this.activity.kill();
                }
                this.dispatcher.dispatch('arrive');
                this.isEntityStoppedAtDestination = false;
                this.isEntityArrivedAtDestination = false;
            }
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
            if (typeof callback !== 'function') {
                return;
            }
            this.dispatcher.addEventListener(event, function once() {
                callback();
                this.dispatcher.removeEventListener(event, once);
            }.bind(this));
        }
    };

    return MotionManager;

});