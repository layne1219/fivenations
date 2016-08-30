define('Map', ['Starfield'], function(Starfield) {

    // map configration template
    var defaultConfig = {
        tiles: {
            tileWidth: 40,
            tileHeight: 40,
            width: 32,
            height: 32
        },
        scrollSpeed: 10
    };

    function Map(config) {
        this.init(config);
        this.validateMapConfig();
    }

    Map.prototype = {

        init: function(config) {
            this.config = config || defaultConfig;
        },

        validateMapConfig: function() {
            if (!this.config || !this.config.tiles) {
                throw 'Invalid config data!';
            }
            if (!this.config.tiles.tileWidth) {
                throw 'Invalid tileWidth property!';
            }
            if (!this.config.tiles.tileHeight) {
                throw 'Invalid tileHeight property!';
            }
            if (!this.config.tiles.width) {
                throw 'Invalid width property!';
            }
            if (!this.config.tiles.height) {
                throw 'Invalid height property!';
            }
        },        

        setGame: function(game) {
            this.game = game;
            this.game.stage.backgroundColor = '#000';

            game.world.setBounds(0, 0, this.getScreenWidth(), this.getScreenHeight());

            this.starfield = new Starfield(this, 0.75);
        },

        update: function() {
            this.starfield.update();
        },

        scrollTo: function(x, y) {
            this.game.camera.x = x;
            this.game.camera.y = y;
        },

        scrollToTile: function(x, y) {
            this.game.camera.x = x * this.config.tiles.tileWidth;
            this.game.camera.y = y * this.config.tiles.tileHeight;
        },

        scrollLeft: function(extent) {
            this.game.camera.x -= extent || defaultConfig.scrollSpeed;
        },

        scrollRight: function(extent) {
            this.game.camera.x += extent || defaultConfig.scrollSpeed;
        },

        scrollUp: function(extent) {
            this.game.camera.y -= extent || defaultConfig.scrollSpeed;
        },

        scrollDown: function(extent) {
            this.game.camera.y += extent || defaultConfig.scrollSpeed;
        },

        getGame: function() {
            return this.game;
        },

        getScreenWidth: function() {
            return this.config.tiles.tileWidth * this.config.tiles.width;
        },

        getScreenHeight: function() {
            return this.config.tiles.tileHeight * this.config.tiles.height;
        },

        getWidth: function() {
            return this.config.tiles.width;
        },

        getHeight: function() {
            return this.config.tiles.height;
        },

        getTileByEntity: function(entity) {
            if (!entity) throw 'Invalid entity was given!';
            var sprite = entity.getSprite(),
                x = Math.floor(sprite.x / this.config.tiles.tileWidth),
                y = Math.floor(sprite.y / this.config.tiles.tileHeight);
            return [x, y];
        }

    }

    return Map;
});