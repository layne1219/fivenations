define('Entity.MotionManager.Effects', function() {

	return {

		/**
         * Move the given entity object towards the x/y coordinates at a steady velocity.
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        moveToTarget: function(motionManager) {

            motionManager.movement.acceleration = 0;
            if (motionManager.movement.distance > motionManager.movement.targetDragTreshold){
                return true;
            } else {
                motionManager.isEntityArrivedAtDestination = true;
                return false;
            }
            
        },

        /**
         * Move the given entity towards the target coordinates with an increasing velocity
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        accelerateToTarget: function(motionManager) {

            motionManager.movement.acceleration = motionManager.movement.maxAcceleration;
            return motionManager.movement.distanceInverse < motionManager.movement.targetDragTreshold && motionManager.movement.velocity < motionManager.movement.maxVelocity;
        },

        /**
         * Making the given entity stop with a certain amount of drag
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        stopping: function(motionManager) {

            motionManager.movement.acceleration = -motionManager.movement.maxAcceleration;
            if (motionManager.movement.distance > 0 && motionManager.movement.distanceFromOrigin < motionManager.movement.targetInitialDistance && motionManager.movement.velocity > 0){
                return true;
            } else {
                if (motionManager.isEntityArrivedAtDestination) {
                    motionManager.isEntityStoppedAtDestination = true;
                }
                return false;
            }

        },

        /**
         * Reset all the helper variables influencing the given entity so that further effects 
         * can be applied on the entitiy
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        resetMovement: function(motionManager) {

            motionManager.movement.acceleration = 0;
            motionManager.movement.velocity = 0;
            motionManager.rotation.angularVelocity = 0;

            return false;
        },

        /**
         * Altering the rotation of the given entity to face towards the target coordinats 
         * @return {boolean} returning false when the effect is no longer must be applied on the entity
         */
        rotateToTarget: function(motionManager) {

            // if the entity is already accrelerating than it doesn't have to stop for rotating
            if (motionManager.movement.velocity > 0) {
                // it also can rotate with a lot higher speed to mimic flying units in Blizzard's Starcraft
                motionManager.rotation.angularVelocity = motionManager.rotation.maxAngularVelocity * 1.5;
                // jumping to the next effect
                return false;
            }

            // rotating with default speed until the entity arrives at the target angle 
            motionManager.rotation.angularVelocity = motionManager.rotation.maxAngularVelocity;
            return motionManager.rotation.currentConsolidatedAngle !== motionManager.rotation.targetConsolidatedAngle;
        }

    };

});