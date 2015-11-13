define("Map", ["Starfield"], function(Starfield){

	// map configration template
	var defaultConfig = {
			tiles: {
				tileWidth: 40,
				tileHeight: 40,
				width: 32,
				height: 32
			}
		},

		Map = function(config) {
			this.init(config);
		}

	Map.prototype = {
		init: function(config){
			this.config = config || defaultConfig;		
		},

		append: function(game){
			this.game = game;
			this.game.stage.backgroundColor = '#000';

    		game.world.setBounds(0, 0, this.getScreenWidth(), this.getScreenHeight());

    		this.starfield = new Starfield(this, 0.75);
    		
		},

		update: function(){
			this.starfield.update();
		},

		validateMapConfig: function(){
			if (!this.config || !this.config.tiles){
				throw "Invalid config data!";
			}
			if (!this.config.tiles.tileWidth){
				throw "Invalid tileWidth property!";
			}
			if (!this.config.tiles.tileHeight){
				throw "Invalid tileHeight property!";
			}
			if (!this.config.tiles.width){
				throw "Invalid width property!";
			}
			if (!this.config.tiles.height){
				throw "Invalid height property!";
			}
		},

		getGame: function(){
			return this.game;
		},

		getScreenWidth: function(){
			this.validateMapConfig();
			return this.config.tiles.tileWidth * this.config.tiles.width;
		},

		getScreenHeight: function(){
			this.validateMapConfig();
			return this.config.tiles.tileWidth * this.config.tiles.width;
		},

		getWidth: function(){
			this.validateMapConfig();
			return this.config.tiles.width;
		},

		getHeight: function(){
			this.validateMapConfig();
			return this.config.tiles.width;
		}
	}

	return Map;
});