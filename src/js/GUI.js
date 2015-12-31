define('GUI', ['Util'], function( Util ){

	var 

		// reference to the shared game configuarition object 
		ns = window.fivenations,

		// reference to the Phaser Game object
		phaserGame,

		// reference to the singleton GUI object 
		singleton,

		// setting up the frames for the individual GUI animations
		animations = (function(){

			return {

				'click-move': [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
				'click-enemy': [ 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
				'click-friendly': [ 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],

				'select-enemy-big': [121, 122, 123, 124, 125],
				'select-enemy-extrabig': [126, 127, 128, 129, 130],
				'select-enemy-medium': [131, 132, 133, 134, 135],
				'select-enemy-small': [136, 137, 138, 139, 140],

				'select-big': [141, 142, 143, 144, 145],
				'select-extrabig': [147, 148, 149, 150, 151],
				'select-medium': [152, 153, 154, 155, 156],
				'select-small': [157, 158, 159, 160, 161]

			};

		})(),

		// size ranges for different spirtes
		categories = {
			'big': [100, 199],
			'extrabig': [200, 999],
			'medium': [50, 99],
			'small': [0, 49]
		},		

		// --------------------------------------------------------------------------------------
		// Selector object to handle the selection animation and the displaying of the 
		// element with the appropriate size
		// --------------------------------------------------------------------------------------
		Selector = (function(){

			var 
				// selection animation frame rate
				SELECTOR_ANIM_FRAME_RATE = 25;

			function Selector(){

				var sprite = phaserGame.add.image(0, 0, 'gui');
				sprite.visible = false;
				sprite.anchor.setTo(0.5, 0.5);

				[
					'select-enemy-big',
					'select-enemy-extrabig',
					'select-enemy-medium',
					'select-enemy-small',
					'select-big',
					'select-extrabig',
					'select-medium',
					'select-small'

				].forEach(function(animation){
					anim = sprite.animations.add(animation, animations[animation]);
				});

				this.sprite = sprite;
			}

			Selector.prototype = {

				size: null,
				parent: null,

				appendTo: function(entity){

					if (!entity || 'function' !== typeof entity.getSprite){
						throw 'First parameter must be an instance of Entity!';
					}

					entity.on('select', this.show.bind(this));
					entity.on('unselect', this.hide.bind(this));					
					entity.getSprite().addChild(this.sprite);

					this.parent = entity;
				},

				show: function(){
					var animationName = 'select-' + this.getSize();
					this.sprite.visible = true;
					this.sprite.play( animationName, SELECTOR_ANIM_FRAME_RATE );
				},

				hide: function(){
					this.sprite.visible = false;
				},

				getSize: function(){
					var sprite;

					if (!this.parent){
						throw 'There is no Entity attached to this Selector instance!';
					}

					if (!this.size){
						sprite = this.parent.getSprite();

						Object.keys(categories).forEach(function(size){
							if (Util.between(Math.max(sprite.width, sprite.height), categories[size][0], categories[size][1])){
								this.size = size;
							}
						}, this);
					}

					return this.size;
				}

			};

			return Selector;

		})(),

		// --------------------------------------------------------------------------------------
		// StatusBar to display the current value of one of the entity's attribute on a 
		// horizontal bar to indicate the percentage
		// --------------------------------------------------------------------------------------
		StatusBar = (function(){

			var backgroundFrames = {
					'big': 162,
					'extrabig': 162,
					'medium': 167,
					'small': 172				
				};

			function F( width ){

				if (undefined === width){
					width = 1;
				}

				// wrapper for the background sprite and the dynamic graphics object 
				this.group = phaserGame.add.group();

				// background for the StatusBar
				this.sprite = phaserGame.add.sprite(0, 0, 'gui');
				this.sprite.frame = backgroundFrames[this.getSize( width )];				

				// graphics for the dynamic bar 
				this.graphics = phaserGame.add.graphics(0, 0);

				// adding the individual elements to the container 
				this.group.add(this.sprite);
				this.group.add(this.graphics);
			}

			F.prototype = {			
				
				update: function( ratio ){

					var color = '0x00FF00';

					if (ratio < 0.67 && ratio > 0.33){
						color = '0xFFFF6B';
					} else if (ratio < 0.34){
						color = '0xFF0000';
					}

			        this.graphics.clear();
			        this.graphics.beginFill(color);
			        this.graphics.drawRect(1, 1, Math.floor(this.sprite.width * ratio) - 2, 3);
			        this.graphics.endFill();

				},

				show: function(){
					this.group.visible = true;
				},

				hide: function(){
					this.group.visible = false;
				},

				getSize: function(width){

					if (!this.size){

						Object.keys(categories).forEach(function(size){
							if (Util.between(width, categories[size][0], categories[size][1])){
								this.size = size;
							}
						}, this);
					}

					return this.size;
				},

				getGroup: function(){
					return this.group;
				}				
			};

			return F;

		})(),

		// --------------------------------------------------------------------------------------
		// Status display for Entities
		// --------------------------------------------------------------------------------------
		StatusDisplay = (function(){

			function F( entity ){

				var width;

				if (!entity || 'function' !== typeof entity.getSprite){
					throw 'First parameter must be an instance of Entity!';
				}

				width = Math.max(entity.getSprite().width, entity.getSprite().height);

				// creating the group for the individual StatusBar objects
				this.group = phaserGame.add.group();
				this.group.visible = false;	

				// Health
				this.healthBar = new StatusBar( width );
				this.healthBar.getGroup().x = this.healthBar.getGroup().width / -2;
				this.healthBar.getGroup().y = entity.getSprite().height / -2;
				this.group.add(this.healthBar.getGroup());

				// Shield if there is any
				if (entity.getDataObject().getMaxShield() > 0){
					this.shieldBar = new StatusBar( width );
					this.shieldBar.getGroup().x = this.shieldBar.getGroup().width / -2;
					this.shieldBar.getGroup().y = entity.getSprite().height / -2 + (this.group.children.length * 6);
					this.group.add(this.shieldBar.getGroup());
				}

				// Power if there is any
				if (entity.getDataObject().getMaxPower() > 0){
					this.powerBar = new StatusBar( width );
					this.powerBar.getGroup().x = this.powerBar.getGroup().width / -2;
					this.powerBar.getGroup().y = entity.getSprite().height / -2 + (this.group.children.length * 6);
					this.group.add(this.powerBar.getGroup());
				}

			}

			F.prototype = {
				
				group: null,
				parent: null,

				appendTo: function( entity ){

					entity.on('select', this.show.bind(this));
					entity.on('unselect', this.hide.bind(this));
					entity.on('damage', this.update.bind(this));	

					entity.getSprite().addChild(this.group);

					this.parent = entity;
				},

				update: function(){

					var dataObject = this.parent.getDataObject(),
						ratio;

      				if (this.healthBar){
      					ratio = dataObject.getHull() / dataObject.getMaxHull();
      					this.healthBar.update( ratio );
      				}

      				if (this.shieldBar){
      					ratio = dataObject.getShield() / dataObject.getMaxShield();
      					this.shieldBar.update( ratio );
      				}

      				if (this.powerBar){
      					ratio = dataObject.getPower() / dataObject.getMaxPower();
      					this.powerBar.update( ratio );
      				}      				
				},

				show: function(){
					this.update();
					this.group.visible = true;
				},

				hide: function(){
					this.group.visible = false;
				}

			};

			return F;

		})(),

		// --------------------------------------------------------------------------------------
		// Status display for Entities
		// --------------------------------------------------------------------------------------
		MiniMap = (function(){

			var mapWidth = ,
				mapHeight = ,
				minimizedWidth = 100,
				minimizedHeight = 100;

			function F(entityManager){

				this.graphics = phaserGame.add.graphics(0, 0);
				this.entityManager = entityManager;

			}

			F.prototype = {

				update: function(){
					this.entityManager.getAll().forEach(function(entity){
						var x = entity.getSprite().x,
							y = entity.getSprite().y;

					});
				}

			};

			return F;

		})();		




	// =============================================================================================
	// 											GUI object 
	// =============================================================================================
	return (function(){

		var 
			/**
			 * Hiding sprite element
			 * @return {void}
			 */
			hide = function(){
				this.visible = false;
			},

			/**
			 * Unhiding sprite element
			 * @return {void}
			 */
			show = function(){
				this.visible = true;
			},

			// reference to a Phaser.Group object that incorporate all the GUI elements
			group,

			// reference to the Phaser.Image represents the basic panel element
			panel,

			// reference to a Phaser.Sprite object that displays the click animation
			clickAnim,

			// Frame rate for the click animations
			CLICK_ANIM_FRAMERATE = 20;


		function GUI(){
			initPhaserGroup();
			initClickAnimations();
			// initialise the panel according to which element it should conceal
			initPanel();
		}

		function initPhaserGroup(){
			group = phaserGame.add.group();
			phaserGame.world.bringToTop(group);
		}

		/**
		 * Initialise the sprite object and link all the animations
		 * @return {void}
		 */
		function initClickAnimations(){
			var anim;
			clickAnim = phaserGame.add.image(0, 0, 'gui');
			clickAnim.visible = false;
			clickAnim.anchor.setTo(0.5, 0.5);

			['click-move', 'click-enemy', 'click-friendly'].forEach(function(animation){

				anim = clickAnim.animations.add(animation, animations[animation]);
				anim.onStart.add(show, clickAnim);
				anim.onComplete.add(hide, clickAnim);

			});

			group.add(clickAnim);
		}

		/**
		 * Initialise the basic panel for the ingame 
		 * @return {void} 
		 */
		function initPanel(){
			panel = phaserGame.add.image(0, 0, 'gui');
			panel.frame = 64; // base element
			panel.x = 0;
			panel.y = ns.window.height - 222; // 222 is the height of the panel (look it up in the JSON when changed)
			panel.fixedToCamera = true;
			group.add(panel);
		}


		GUI.prototype = {

			/**
			 * Placing and triggering the click animation onto the game area
			 * @param  {integer} x
			 * @param  {integer} y
			 * @param  {integer} anim
			 * @return {void}
			 */
			putClickAnim: function(x, y, anim){
				if (undefined === anim){
					anim = 'click-move';
				}
				clickAnim.x = x;
				clickAnim.y = y;
				clickAnim.animations.stop(null, true);
				clickAnim.play(anim, CLICK_ANIM_FRAMERATE);
			}

		};

		return {

			/**
			 * Passing the ultimate Phaser.Game object in order to access basic Phaser functionality  
			 * @param {void}
			 */
			setGame: function( game ){
				phaserGame = game;
			},

			/**
			 * Accessing the singleton instance of the GUI 
			 * @return {object} GUI
			 */
			getInstance: function(){
				if (!phaserGame){
					throw 'Invoke setGame first to pass the Phaser Game entity!';
				}			
				if (!singleton){
					singleton = new GUI();
				}
				return singleton;
			},

			/**
			 * Linking the Selector object to a Entity
			 * @param {Entity} entity 
			 */
			addSelector: function( entity ){
				var selector = new Selector();
				selector.appendTo( entity );
				return selector;
			},


			/**
			 * Linking the StatusDisplay object to a Entity
			 * @param {Entity} entity 
			 */
			addStatusDisplay: function( entity ){
				var statusDisplay = new StatusDisplay( entity );
				statusDisplay.appendTo( entity );
				return statusDisplay;
			}			

		};


	})();


});