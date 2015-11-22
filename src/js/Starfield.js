// ************************************************************************************************
// 												Star 
// ************************************************************************************************
define('Starfield.Star', ['color'], function(color){

	var ns = window.fivenations,
		width = ns.window.width,
		height = ns.window.height;

	function Star(){
	}

	Star.prototype = {

		setX: function(x){
			this.x = x;
			return this;
		},

		setY: function(y){
			this.y = y;
			return this;			
		},

		setZ: function(z){
			this.z = z;
			return this;			
		},

		setSprite: function(sprite){
			this.sprite = sprite;
			return this;			
		},

		update: function(texture, game, clearLayer){
			if (!texture || !this.sprite){
				return;
			}
			texture.renderXY(
				this.sprite, 
				this.x - game.camera.x * this.z, 
				this.y - game.camera.y * this.z, 
				!!clearLayer
			);

			// assessing whether the star is drifted off screen
			if (this.x + this.sprite.width - game.camera.x * this.z < 0){
				this.setX( this.x + this.sprite.width + width);
			} else if (this.x - game.camera.x * this.z > width){
				this.setX( this.x - this.sprite.width - width);
			} else if (this.y + this.sprite.height - game.camera.y * this.z < 0){
				this.setY( this.y + this.sprite.height + height);
			} else if (this.y - game.camera.y * this.z > height){
				this.setY( this.y - this.sprite.height - height);
			}

		}

	};

	return Star;
});

// ************************************************************************************************
// 												Layer 
// ************************************************************************************************
define('Starfield.StarLayer', ['Starfield.Star'], function(Star){

	var MAX_STAR_NUMBER = 100,

		ns = window.fivenations,
		width = ns.window.width || 640,
		height = ns.window.height || 480;

	function StarLayer(game, density){
		initialise.call(this, game, density || 1);
	}

	function initialise(game, density){
		var number_of_stars = Math.round(MAX_STAR_NUMBER * density);

		this.game = game;

		createTexture.call(this, game);
		createSprites.call(this, game);
		createStars.call(this, number_of_stars)
	}

	function createTexture(game){
		this.texture = game.add.renderTexture(width, height, 'Starfield.Stars.Texture');

		container = game.add.sprite(0, 0, this.texture);
		container.fixedToCamera = true;
	}

	function createSprites(game){
		if (ns.cache.starfield){
			return;
		}

		ns.cache.starfield = {};
		ns.cache.starfield.sprites = {
			"slow": [
				game.make.sprite(0, 0, 'starfield.star.slow-1'),
				game.make.sprite(0, 0, 'starfield.star.slow-2'),
				game.make.sprite(0, 0, 'starfield.star.slow-3')
			],
			"mediate": [
				game.make.sprite(0, 0, 'starfield.star.mediate-1'),
				game.make.sprite(0, 0, 'starfield.star.mediate-2'),
				game.make.sprite(0, 0, 'starfield.star.mediate-3')
			],
			"fast": [
				game.make.sprite(0, 0, 'starfield.star.fast-1'),
				game.make.sprite(0, 0, 'starfield.star.fast-2'),
				game.make.sprite(0, 0, 'starfield.star.fast-3')
			]			
		};		
	}

	function createStars(number_of_stars){

		this.stars = [];

		for (var i = 0; i < number_of_stars; i++) {
			addStar.call(this);
		};

		this.stars.sort(function(a, b){
			return b.z - a.z;
		});	
	}

	function addStar(sprite){
		var z = Math.min(Math.random() + 0.15 + (0.75 * (ns.util.rnd(0, 10) >= 5 ? 1 : 0)), 0.9),
			sprite = getSpriteFromZ(z),

			star = new Star().setX( ns.util.rnd(0, width) )
						 	 .setY( ns.util.rnd(0, height) )
						 	 .setZ( z )
						 	 .setSprite( sprite );

		this.stars.push(star);
	}

	function getSpriteFromZ(z){
		var index = ns.util.rnd(0, 3),
			key = 'slow',
			sprites = ns.cache.starfield.sprites;

		if (z >= 0.34 && z <= 0.65){
			key = 'mediate';
		} else if (z > 0.65){
			key = 'fast';
		}
		if (!sprites[key] || !sprites[key][index]){
			throw 'Invalid sprite was given for a Star object!';
		}
		return sprites[key][index];
	}

	StarLayer.prototype = {	

		update: function(){
			var first = true;

			for (var i = this.stars.length - 1; i >= 0; i--) {
				// the last param indicates whether to clear the texture of the layer or not
				this.stars[i].update(this.texture, this.game, first);

				first = false;
			};
		},

	};

	return StarLayer;
});

// ************************************************************************************************
// 												Background 
// ************************************************************************************************
define('Starfield.Background', function(){

	var BACKGROUND_SPEED = 0.1;

	function Background(game){
		initialise.call(this, game);
	}

	function initialise(game){
		this.game = game;
		this.background = game.add.tileSprite(0, 0, 1024, 1024, 'starfield');
		this.background.fixedToCamera = true;
	}

	Background.prototype = {

		update: function(){
			this.background.tilePosition.x = -this.game.camera.x * BACKGROUND_SPEED;
			this.background.tilePosition.y = -this.game.camera.y * BACKGROUND_SPEED;
		}

	};

	return Background;
});

// ************************************************************************************************
// 												Starfield 
// ************************************************************************************************
define('Starfield', ['Starfield.StarLayer', 'Starfield.Background'], function(StarLayer, Background){

	var MAX_STAR_NUMBER = 1000,
		STARLAYER_DENSITY = 0.5;

	function Starfield(map, density){
		initialise.call(this, map, density);
	}

	function initialise(map, density){
		this.initLayers();
		this.createBackground(map.getGame());
		this.createStars(map.getGame());	
	}

	Starfield.prototype = {

		initLayers: function(){
			this.layers = [];
		},

		createBackground: function(game){
			this.layers.push( new Background(game) );
		},

		createStars: function(game){
			this.layers.push( new StarLayer(game, STARLAYER_DENSITY) );
		},

		update: function(){

			this.layers.forEach(function(layer){
				layer.update();
			});

		}

	};

	return Starfield;
});