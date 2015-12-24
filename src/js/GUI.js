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

		// Selector object to handle the selection animation and the displaying of the 
		// element with the appropriate size
		Selector = (function(){

			var 
				// selection animation frame rate
				SELECTOR_ANIM_FRAME_RATE = 25,

				// size ranges for different spirtes
				categories = {
					'big': [100, 199],
					'extrabig': [200, 999],
					'medium': [50, 99],
					'small': [0, 49]
				};

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
					var sprite;

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
			setGame: function(game){
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

			// publishing the Selector function in order to instantiate it outside this scope
			Selector: Selector	

		};


	})();


});