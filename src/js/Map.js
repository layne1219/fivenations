define('Map', [
    'Starfield', 
    'Map.Fogofwar', 
    'Util'
], function(Starfield, Fogofwar, Util) {

    var FOG_OF_WAR_REFRESH_RATE = 50;

    // map configration template
    var TILE_WIDTH = 40;
    var TILE_HEIGHT = 40;
    var SCROLL_SPEED = 10;

    function Map(config) {
        this.init(config);
    }

    Map.prototype = {

        init: function(config) {

            if (!config.width || config.width < 32) {
                throw 'Invalid width property! It must be a valid number bigger than 32!';
            }
            if (!config.height || config.height < 32) {
                throw 'Invalid width property! It must be a valid number bigger than 32!';
            }

            this.config = config;
            this.config.tileWidth = TILE_WIDTH;
            this.config.tileHeight = TILE_HEIGHT;
            this.config.scrollSpeed = SCROLL_SPEED;
        },        

        setGame: function(game) {
            this.game = game;
            this.game.stage.backgroundColor = '#000';
            game.world.setBounds(0, 0, this.getScreenWidth(), this.getScreenHeight());
            this.initLayers();
        },

        initLayers: function() {
            this.starfield = new Starfield(this);
            this.fogofwar = Fogofwar.create(this);
            this.fogofwar.update = Util.interval(this.fogofwar.update, FOG_OF_WAR_REFRESH_RATE, this.fogofwar);
        },

        update: function(entityManager) {
            this.starfield.update();
            this.fogofwar.update(entityManager);
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
            this.game.camera.x -= extent || this.config.scrollSpeed;
        },

        scrollRight: function(extent) {
            this.game.camera.x += extent || this.config.scrollSpeed;
        },

        scrollUp: function(extent) {
            this.game.camera.y -= extent || this.config.scrollSpeed;
        },

        scrollDown: function(extent) {
            this.game.camera.y += extent || this.config.scrollSpeed;
        },

        getGame: function() {
            return this.game;
        },

        getScreenWidth: function() {
            return this.config.tileWidth * this.config.width;
        },

        getScreenHeight: function() {
            return this.config.tileHeight * this.config.height;
        },

        getWidth: function() {
            return this.config.width;
        },

        getHeight: function() {
            return this.config.height;
        },

        getTileWidth: function() {
            return this.config.tileWidth;
        },

        getTileHeight: function() {
            return this.config.tileHeight;
        },

        getFogofwar: function() {
            return this.fogofwar;
        }

    }

    return Map;
});