define('GUI', ['Util'], function( Util ){

	var 

		// reference to the shared game configuarition object 
		ns = window.fivenations,

		// reference to the Phaser Game object
		phaserGame,

		// reference to the EntityManager singleton object
		entityManager,

		// reference to the Map object
		map,

		// reference to the UserPointer
		userPointer,

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


		// Rainbow table for entity icons 
		entityIcons = {

			'hurricane': { spriteId: 'gui.icons.fed', faceFrame: 67, iconFrame: 14 }

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
					var relationship = (function(selector){
							if (entityManager.isEntityControlledByUser(selector.parent)){
								return '-';
							}
							return '-enemy-'
						})(this),

						animationName = 'select' + relationship + this.getSize();
						
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

				/**
				 * attaching the StatusDisplay to an entity
				 * @param  {[object]} entity [reference to an instance of an Entity]
				 * @return {[void]}
				 */
				appendTo: function( entity ){

					entity.on('select', this.show.bind(this));
					entity.on('unselect', this.hide.bind(this));
					entity.on('damage', this.update.bind(this));	

					entity.getSprite().addChild(this.group);

					this.parent = entity;
				},

				/**
				 * Refresing the graphics objects according to the current values of 
				 * the exposed abilities of the entity
				 * @return {[void]}
				 */
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

				/**
				 * Making the StatusDisplay visible
				 * @return {[void]}
				 */
				show: function(){
					this.update();
					this.group.visible = true;
				},

				/**
				 * Making the StatusDisplay unvisible
				 * @return {[void]}
				 */
				hide: function(){
					this.group.visible = false;
				}

			};

			return F;

		})(),

		// --------------------------------------------------------------------------------------
		// Status display for Entities
		// --------------------------------------------------------------------------------------
		Minimap = (function(){

			var minimizedWidth = 160,
				minimizedHeight = 160;

			/**
			 * Minimap construct function in order to get the manager instances that needed to draw
			 * the map with all the elements need to be displayed
			 * @param {[object]} map           [reference to a Map instance]
			 * @param {[object]} entityManager [reference to the singleton instance of EntityManager]
			 */
			function F(map, entityManager){

				// Create a graphics object to display the desired elements
				this.graphics = phaserGame.add.graphics(0, 0);			
					
				// referencies to local variables 
				this.map = map;
				this.entityManager = entityManager;

				// calculating the ratio
				this.ratio = {
					x: minimizedWidth / this.map.getScreenWidth(),
					y: minimizedHeight / this.map.getScreenHeight()
				};

			}

			function setEventListeners(){
				setLeftButtonListeners.call(this);
				setRightButtonListeners.call(this);
			}

			function setLeftButtonListeners(){
				// making the minimap area clickable 
				userPointer.on('leftbutton/move', function(pointer){

					var coords = getMouseCoords(pointer, this.map, this.panel, this.graphics, true);

					// if getMouseCoords returns with false then the coordinates are not legit
					if (!coords){
						return;
					}

					this.map.scrollTo(coords.x, coords.y);

				}.bind(this));					
			}

			function setRightButtonListeners(){
				// making the minimap area clickable 
				userPointer.on('rightbutton/down', function(pointer){

					var coords = getMouseCoords(pointer, this.map, this.panel, this.graphics);

					// if getMouseCoords returns with false then the coordinates are not legit
					if (!coords){
						return;
					}

					this.entityManager.getAllSelected().forEach(function(entity){
						if (this.entityManager.isEntityControlledByUser(entity)){
							entity.moveTo(coords.x, coords.y);
						}
					}.bind(this));
					
				}.bind(this));
			}

			function getMouseCoords(pointer, map, panel, graphics, alignToCentre){
				var mapWidth = map.getScreenWidth(),
					mapHeight = map.getScreenHeight(),
					ratioX = ns.window.width / mapWidth,
					ratioY = ns.window.height / mapHeight,
					width = minimizedWidth * ratioX,
					height = minimizedHeight * ratioY,
					mouseX = pointer.x - panel.x + phaserGame.camera.x - graphics.x,
					mouseY = pointer.y - panel.y + phaserGame.camera.y - graphics.y,
					ratioX,
					ratioY;

				if (mouseX > minimizedWidth || mouseY > minimizedHeight || mouseY < 0){
					return false;
				}

				// cancelling the multiselection 
				userPointer.stopMultiselection();

				if (alignToCentre){
					mouseX -= width / 2;
					mouseY -= height / 2;
				}

				ratioX = mouseX / minimizedWidth;
				ratioY = mouseY / minimizedHeight;

				return {
					x: mapWidth * ratioX,
					y: mapHeight * ratioY
				}
			}

			F.prototype = {

				/**
				 * 	
				 * Attach the Minimap object to the main GUI Panel
				 * @param {object} panel Main GUI Panel
				 * @param {integer} x Horizontal offset from the parent's anchor point 
				 * @param {integer} y Vertical offset from the parent's anchor point 
				 */
				appendTo: function(panel, x, y){

					if (!panel){
						throw 'Invalid Phaser.Sprite object!';
					}

					panel.addChild(this.getGraphics());
					this.graphics.x = x;
					this.graphics.y = y; // this is the place for the minimap on the big panel sprite

					this.panel = panel;

					// registering the callbacks listening for the mouse event in order to execute 
					// further logic when the user interacts with the Minimap
					setEventListeners.call(this);
				},

				/**
				 * Resetting the graphics object
				 * @return {void}
				 */
				reset: function(){
					this.graphics.clear();					
				},

				/**
				 * Updating the minimap
				 * @return {void} 				 
				 */
				update: function(){
					this.reset();
					this.updateEntities();
					this.updateCamera();
				},

				/**
				 * update all entities on the minimap
				 * @return {void}
				 */
				updateEntities: function(){
					this.entityManager.get().forEach(function(entity){
						var x = entity.getSprite().x / this.map.getScreenWidth() * minimizedWidth,
							y = entity.getSprite().y / this.map.getScreenHeight() * minimizedHeight,
							w = Math.max(1, entity.getDataObject().getWidth() / this.map.getScreenWidth() * minimizedWidth),
							h = Math.max(1, entity.getDataObject().getHeight() / this.map.getScreenHeight() * minimizedHeight),
							color = ns.players.colors[entity.getDataObject().getTeam() - 1];

					this.graphics.beginFill(color);
					this.graphics.drawRect(x, y, w, h);
					this.graphics.endFill();

					}.bind(this));
				},			

				/**
				 * Redrawing the rectangle showing the viewport of the phaser camera object
				 * @return {void} 
				 */
				updateCamera: function(){
					var ratioX = ns.window.width / this.map.getScreenWidth(),
						ratioY = ns.window.height / this.map.getScreenHeight(),
						w = minimizedWidth * ratioX,
						h = minimizedHeight * ratioY,
						x = phaserGame.camera.x / (this.map.getScreenWidth() - ns.window.width) * (minimizedWidth - w),
						y = phaserGame.camera.y / (this.map.getScreenHeight() - ns.window.height) * (minimizedHeight - h),					
						color = '0xFFFFFF';

					this.graphics.lineStyle(1, color, 1);
					this.graphics.drawRect(x, y, w, h);				
				},

				/**
				 * Returning the Phaser.Graphics object being used
				 * @return {Phaser.Graphics} 
				 */
				getGraphics: function(){
					return this.graphics;
				},


			};

			return F;

		})(),

		// --------------------------------------------------------------------------------------
		// EntityDetailsDisplay for Entities
		// --------------------------------------------------------------------------------------
		EntityDetailsDisplay = (function(){

			/**
			 * Constructing an EntityDetailsDisplay instance
			 * @param {object} entityManager [reference to the singleton instance of EntityManager]
			 */
			function F(entityManager){

				// creating the group for the individual StatusBar objects
				this.group = phaserGame.add.group();
				this.group.visible = false;

				// storing the entity manager locally
				this.entityManager = entityManager;

				// creating a Phaser.Sprite object for the entity icons
				this.iconSprite = phaserGame.add.sprite(0, 0, 'gui.icons.fed');

				// setting up the text group
				this.textGroup = createTextGroup();

				// adding the individual elements to the container 
				this.group.add(this.iconSprite);
				this.group.add(this.textGroup);
			}

			function createTextGroup(){
				var group = phaserGame.add.group();

			}

			F.prototype = {
				
				iconSprite: null,
				group: null,
				panel: null,

				/**
				 * Attach the Minimap object to the main GUI Panel
				 * @param {object} panel Phaser.Sprite
				 * @param {integer} x Horizontal offset from the parent's anchor point 
				 * @param {integer} y Vertical offset from the parent's anchor point 
				 */
				appendTo: function(panel, x, y){

					if (!panel){
						throw 'Invalid Phaser.Sprite object!';
					}

					this.group.x = x;
					this.group.y = y;
					panel.addChild(this.group);					

					this.panel = panel;
				},

				/**
				 * Refresing the graphics objects according to the current values of 
				 * the exposed abilities of the entity
				 * @return {[void]}
				 */
				update: function(){

					var entities = this.entityManager.getAllSelected();

					// no entity is selected
					if (entities.length !== 1){
						this.hide();
						return;
					}

					// show the panel
					this.show();
					this.displaySingleEntityScene(entities[0]);

				},

				/**
				 * Displaying the GUI elements for the single selection screen
				 * @return {object} entity Entity
				 */
				displaySingleEntityScene: function(entity){

					if (!entity){
						throw 'Invalid Entity object!';
					}

					this.iconSprite.frame = entityIcons[entity.getDataObject().getId()].faceFrame;

				},

				/**
				 * Displaying the GUI elements for the multi selection screen
				 * @return {array} entities Array of Entity instances
				 */
				displayMultipleEntityScene: function(entities){

					if (!entities){
						throw 'Invalid Entity object!';
					}

				},				

				/**
				 * Making the StatusDisplay visible
				 * @return {[void]}
				 */
				show: function(){
					this.group.visible = true;
				},

				/**
				 * Making the StatusDisplay unvisible
				 * @return {[void]}
				 */
				hide: function(){
					this.group.visible = false;
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

			// reference to the Minimap object 
			minimap,

			// DataObjectProjector
			entityDetailsDisplay,

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

			// Setting up the Minimap and attacing to the Panel
			minimap = new Minimap(map, entityManager);
			minimap.appendTo(panel, 0, 61);

			// Setting up the EntityDetailsDisplay and linking it to the Panel
			entityDetailsDisplay = new EntityDetailsDisplay(entityManager);
			entityDetailsDisplay.appendTo(panel, 200, 110);

			// adding to the GUI group to move all these elements to the top of the game scene
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
			},

			/**
			 * Updating the renderable elements 
			 * @return {void} 
			 */
			update: function(){

				if (minimap){
					minimap.update();
				}

				if (entityDetailsDisplay){
					entityDetailsDisplay.update();
				}
			}

		};

		return {

			/**
			 * Passing the ultimate Phaser.Game object in order to access basic Phaser functionality  
			 * @param {void}
			 */
			setGame: function( game ){
				phaserGame = game;
				return this;
			},

			/**
			 * Passing the entityManager object to retrive Entity objects in order to display
			 * entity attributes on the Panel
			 * @param {objet} [_entityManager] [reference to EntityManager singleton]
			 * @param {void}
			 */
			setEntityManager: function( _entityManager ){
				entityManager = _entityManager;
				return this;				
			},

			/**
			 * Passing the Map object to fetch map details mostly for rendering the Minimap 
			 * @param {objet} [_map] [reference to Map singleton]
			 * @param {void}
			 */
			setMap: function( _map ){
				map = _map;
				return this;				
			},

			/**
			 * UserPointer object to register custom listeners for interactions with the mouse
			 * @param {object} _userPointer UserPointer
			 */
			setUserPointer: function( _userPointer ){
				userPointer = _userPointer;
				return this;
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
			}


		};


	})();


});