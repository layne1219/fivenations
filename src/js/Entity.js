define('Entity', [
    'Universal.EventDispatcher',
    'Entity.ActivityManager',
    'Entity.MotionManager',
    'Entity.AbilityManager', 
    'GUI', 
    'UserKeyboard', 
    'UserPointer',
    'Universal.EventBus',
    'Util'
], function(UED, ActivityManager, MotionManager, AbilityManager, GUI, UserKeyboard, UserPointer, EventBus, Util){
	
    var 

        SLOW_MANOUVERABAILITY_TRESHOLD = 25,

        ns = window.fivenations,

        /**
         * Initialising the Phaser.Sprite object with all the additional child elements 
         * such as selector and property bars 
         * @param {[object]} [entity] [Entity object that owns the [sprite] Phaser.Sprite instance]
         * @param {[object]} [sprite] Phaser.Sprite object to which the extended properties and child elements will be linked
         * @param {[object]} [dataObject] [DataObject instance containing all the informations about the entity being instantiated]
         * @return {[object]} 
         */
        extendSprite = function(entity, sprite, dataObject){

            // actiavting the ARCADE physics on the sprite object
            entity.game.physics.enable(sprite, Phaser.Physics.ARCADE);

            // Set up the Phaser.Sprite object
            sprite.anchor.setTo(0.5, 0.5);        

            // enabling input events applied on the sprite object
            sprite.inputEnabled = true;

            // helper variable for storing whether the input is over the sprite
            sprite.hover = false;

            // applying event listeners on the passed sprite object
            extendSpriteWithEventListeners(entity, sprite, dataObject);       

            // coords
            sprite.x = 0;
            sprite.y = 0;

            // reducing the hitArea according the one specified in the realated DataObject
            sprite.hitArea = new Phaser.Rectangle(dataObject.getWidth() / -2, dataObject.getHeight() / -2, dataObject.getWidth(), dataObject.getHeight());

            return sprite;
        },

        /**
         * Extending the given sprite with event listeners
         * @param {[object]} [entity] [Entity object that owns the [sprite] Phaser.Sprite instance]
         * @param {[object]} sprite Phaser.Sprite object to which the extended properties and child elements will be linked
         * @param {[object]} [dataObject] [DataObject instance containing all the informations about the entity being instantiated]
         * @return {[object]} 
         */
        extendSpriteWithEventListeners = function(entity, sprite, dataObject){
            // input events registered on the sprite object
            sprite.events.onInputDown.add(function(){
                var now,
                    game = this.game;
                if (UserPointer.getInstance().isLeftButtonDown()){
                    // If the user holds SHIFT we will extend the number of selected entities
                    if (!UserKeyboard.getInstance().isDown( Phaser.KeyCode.SHIFT )){
                        this.entityManager.unselectAll();
                    }
                    this.select();

                    now = new Date().getTime();
                    if (now - this.lastClickTime < 500){
                        this.entityManager.get().filter(function(entity){
                            // If the entity is off screen we need to exclude
                            if (!Util.between(entity.getSprite().x - game.camera.x, 0, ns.window.width)){
                                return false;
                            }
                            if (!Util.between(entity.getSprite().y - game.camera.y, 0, ns.window.height)){
                                return false;
                            }
                            // we need to include only the indentical entities                           
                            return entity.getDataObject().getId() === dataObject.getId();
                        }).forEach(function(entity){
                            entity.select();
                        });
                    }

                    // this needs to be attached to the individual sprite instance
                    this.lastClickTime = now;
                }
            }, entity);

            sprite.events.onInputOut.add(function(){
                sprite.hover = false;
            }, this);

            sprite.events.onInputOver.add(function(){
                sprite.hover = true;
            }, this); 
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

        // persisting the sprite object and attaching it to the Entity object 
        this.sprite = extendSprite(this, sprite, dataObject);

        // adding the Selector object to highligh whether the unit is seleted or not
        this.selector = GUI.getInstance().addSelector(this);

        // adding the StatusDisplay object to show the current status 
        // of the entity's attributes
        this.statusDisplay = GUI.getInstance().addStatusDisplay(this);

        // ActivityManager
        this.activityManager = new ActivityManager();

        // MotionManager for altering the coordinates of the entity
        this.motionManager = new MotionManager(this);

        // AbilityManager for determining which abilities are available for this entity
        this.abilityManager = new AbilityManager(this);
        
    }

	Entity.prototype = {

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

            // Updating the activities handled by the activity manager instance
            this.activityManager.update();

            // applying all the effects that influences the movement of the entity
            this.motionManager.update();

        },

        /**
         * Altering the entity's position 
         * @param  {[integer]} targetX [description]
         * @param  {[integer]} targetY [description]
         * @return {[void]}
         */
        moveTo: function(targetX, targetY){
            this.motionManager.moveTo(targetX, targetY);
        },

        stop: function(){
            this.motionManager.stop();
            this.eventDispatcher.dispatch('stop', this);
        },

        damage: function( value ){
            this.getDataObject().damageHull( value );
            this.eventDispatcher.dispatch('damage');
            this.eventDispatcher.dispatch('change');
        },

        patrol: function(x, y){
            var patrol = new ActivityManager.Patrol(this);
            patrol.setStartPoint( this.sprite.x, this.sprite.y );
            patrol.setDestionation( x, y );
            this.activityManager.add( patrol );
        },

        follow: function(targetEntity){
            var follow = new ActivityManager.Follow(this);
            follow.setTarget(targetEntity);
            this.activityManager.add( follow );
        },

        select: function(){
            if (this.entityManager.getAllSelected().length < this.entityManager.getMaxSelectableUnitNumber()){
        	   this.selected = true;
               this.eventDispatcher.dispatch('select');
               UED.getInstance().dispatch('gui/selection/change');
            }
        },

        unselect: function(){
        	this.selected = false;
            this.eventDispatcher.dispatch('unselect');
            UED.getInstance().dispatch('gui/selection/change');
        },

        hasSlowManeuverability: function(){
            return this.getDataObject().getManeuverability() < SLOW_MANOUVERABAILITY_TRESHOLD;
        },

        isSelected: function(){
        	return !!this.selected;
        },

        isHover: function(){
        	return this.sprite.hover;
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

        getActivityManager: function(){
            return this.activityManager;
        },

        getAbilityManager: function(){
            return this.abilityManager;
        },

        getId: function(){
            return this.uid;
        }        
       
	};

	return Entity;

});

