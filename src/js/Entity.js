define('Entity', ['GUI', 'UserKeyboard', 'UserPointer', 'Util'], function(GUI, UserKeyboard, UserPointer, Util){
	
    var 
        /**
         * Initialising the Phaser.Sprite object with all the additional child elements 
         * such as selector and property bars 
         * @param {[object]} sprite Phaser.Sprite object to which the extended properties and child elements will be linked
         * @param {[object]} [dataObject] [DataObject instance containing all the informations about the entity being instantiated]
         * @return {[object]} 
         */
        extendSprite = function(sprite, dataObject){

            // actiavting the ARCADE physics on the sprite object
            this.game.physics.enable(sprite, Phaser.Physics.ARCADE);

            // Set up the Phaser.Sprite object
            sprite.anchor.setTo(0.5, 0.5);        

            // enabling input events applied on the sprite object
            sprite.inputEnabled = true;

            // helper variable for storing whether the input is over the sprite
            sprite.hover = false;

            // input events registered on the sprite object
            sprite.events.onInputDown.add(function(){
                if (UserPointer.getInstance().isLeftButtonDown()){
                    // If the user holds SHIFT we will extend the number of selected entities
                    if (!UserKeyboard.getInstance().isDown( Phaser.KeyCode.SHIFT )){
                        this.entityManager.unselectAll();
                    }
                    this.select();
                }
            }, this);
            sprite.events.onInputOut.add(function(){
                sprite.hover = false;
            }, this);
            sprite.events.onInputOver.add(function(){
                sprite.hover = true;
            }, this);         

            // coords
            sprite.x = 0;
            sprite.y = 0;

            // reducing the hitArea according the one specified in the realated DataObject
            sprite.hitArea = new Phaser.Rectangle(dataObject.getWidth() / -2, dataObject.getHeight() / -2, dataObject.getWidth(), dataObject.getHeight());

            return sprite;
        };


	/**
     * Constructor function for Entity 
     * @param {object} entityManager Instance of the EntityManager
     * @param {object} sprite        preinitialised Phaser.Sprite
     * @param {object} dataObject    A instance of DataObject 
     */
	function Entity(entityManager, sprite, dataObject){

		// storing entityManager locally to prevent recursive mutual dependency
		this.entityManager = entityManager;

		// retrive the Phaser.Game object
        this.game = entityManager.getGame();

        // unique identifier in order to obtain the very entity
        this.uid = entityManager.getNextId();

        // setting up the dataObject
        this.dataObject = dataObject;

        // setting up the EventDisatcher
        this.eventDispatcher = new Util.EventDispatcher();

        // Container to store the applied effects 
        this.effects = [];

        // Whether the Entity is selected or not 
        this.selected = false;

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
        };

        // persisting the sprite object and attaching it to the Entity object 
        this.sprite = extendSprite.call(this, sprite, dataObject);

        // adding the Selector object to highligh whether the unit is seleted or not
        this.selector = GUI.getInstance().addSelector(this);

        // adding the StatusDisplay object to show the current status 
        // of the entity's attributes
        this.statusDisplay = GUI.getInstance().addStatusDisplay(this);
        
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
        * Updating the velocity according to the applied effects altering the coordinates of the Entity
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

            if (this.movement.velocity > 0 && this.hasSlowManeuverability()){
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
        	this.sprite.frame = this.rotation.currentConsolidatedAngle;
        },

        /**
         * registering custom callbacks to the passed events
         * @param  {string}   event    
         * @param  {Function} callback 
         * @return {void}            
         */
        on: function(event, callback){
            this.eventDispatcher.addEventListener(event, callback);
        },

        /**
         * Rendering the entity
         * @return {void} 
         */
        update: function(){

        	// updating all the helper values to alter the entity properties which take part in the movements 
            this.updateVelocity();
            this.updateRotation();
            // this should be the last invoked function here
            this.updateEffects();

            //this.game.debug.geom(new Phaser.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height),'#0fffff', false);
        },

        damage: function( value ){
            this.getDataObject().damageHull( value );
            this.eventDispatcher.dispatch('damage');
            this.eventDispatcher.dispatch('change');
        },

        select: function(){
            if (this.entityManager.getAllSelected().length < this.entityManager.getMaxSelectableUnitNumber()){
        	   this.selected = true;
               this.eventDispatcher.dispatch('select');
            }
        },

        unselect: function(){
        	this.selected = false;
            this.eventDispatcher.dispatch('unselect');
        },

        isSelected: function(){
        	return this.selected;
        },

        isHover: function(){
        	return this.sprite.hover;
        },

        hasSlowManeuverability: function(){
            return this.getDataObject().getManeuverability() < 25;
        },

        isInside: function(obj){
        	if (this.sprite.x + this.getDataObject().getWidth() / 2 < obj.x){
        		return false;
        	}
        	if (this.sprite.x - this.getDataObject().getWidth() / 2 > obj.x + obj.width){
        		return false;
        	} 
        	if (this.sprite.y + this.getDataObject().getHeight() / 2 < obj.y){
        		return false;
        	}
        	if (this.sprite.y - this.getDataObject().getHeight() / 2 > obj.y + obj.height){
        		return false;
        	}
        	return true;        	      	
        },

        getSprite: function(){
            return this.sprite;
        },

        getDataObject: function(){
            return this.dataObject;
        },

        getId: function(){
            return this.uid;
        }        
       
	};

	return Entity;

});

