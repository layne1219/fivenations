// ************************************************************************************************
// 												SpaceObject 
// ************************************************************************************************
define('Starfield.SpaceObject', function() {

    function SpaceObject() {}

    SpaceObject.prototype = {

        setX: function(x) {
            this.x = x;
            return this;
        },

        setY: function(y) {
            this.y = y;
            return this;
        },

        setZ: function(z) {
            this.z = z;
            return this;
        },

        setSprite: function(sprite) {
            this.sprite = sprite;
            return this;
        },

        update: function(texture, game, clearLayer) {
            if (!texture || !this.sprite) {
                return;
            }
            texture.renderXY(
                this.sprite,
                this.x - game.camera.x * this.z,
                this.y - game.camera.y * this.z, !!clearLayer
            );
        }

    };

    return SpaceObject;
});

// ************************************************************************************************
//                                              Star 
// ************************************************************************************************
define('Starfield.Star', ['Starfield.SpaceObject'], function(SpaceObject) {
    
    var ns = window.fivenations,
        width = ns.window.width,
        height = ns.window.height;

    function Star() {
        SpaceObject.call(this);
    }

    Star.prototype = new SpaceObject();
    Star.prototype.constructor = Star;

    Star.prototype.update = function(texture, game, clear) {
        SpaceObject.prototype.update.call(this, texture, game, clear);
      
        // assessing whether the star is drifted off screen
        if (this.x + this.sprite.width - game.camera.x * this.z < 0) {
            this.setX(this.x + this.sprite.width + width);
        } else if (this.x - game.camera.x * this.z > width) {
            this.setX(this.x - this.sprite.width - width);
        } else if (this.y + this.sprite.height - game.camera.y * this.z < 0) {
            this.setY(this.y + this.sprite.height + height);
        } else if (this.y - game.camera.y * this.z > height) {
            this.setY(this.y - this.sprite.height - height);
        }

    }

    return Star;

});

// ************************************************************************************************
//                                        StarObjectGenerator
// ************************************************************************************************
define('Starfield.SpaceObjectGenerator', function() {

    return function SpaceObjectGenerator(game) {
        this.game = game;
    }

    SpaceObjectGenerator.prototype = {
        
        objects: [],
        
        getSpaceObjects: function() {

            this.objects.sort(function(a, b) {
                return b.z - a.z;
            });

            return this.objects;
        },

        addObject: function(obj) {
            if (!obj) throw 'Invalid SpaceObject was given!';
            this.objects.push(obj);
        }

    };

    return SpaceObjectGenerator;

});
// ************************************************************************************************
// 										StarGenerator 
// ************************************************************************************************
define('Starfield.StarGenerator', [
    'Starfield.Star',
    'Starfield.SpaceObjectGenerator'
    'Util'
], function(Star, SpaceObjectGenerator, Util) {

    var NUMBER_OF_STARS_PER_SCREEN = 10; 
    var ns = window.fivenations;
    var width = ns.window.width;
    var height = ns.window.height;
    var sprites;

    function StarGenerator(game) {
        SpaceObjectGenerator.call(this, game);
        createSprites.call(this);
        createStars.call(this, NUMBER_OF_STARS_PER_SCREEN)
    }

    StarGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    StarGenerator.prototype.constructor = StarGenerator;

    function createSprites() {
        if (sprites) return;

        sprites = {
            mediate: [
                this.game.make.sprite(0, 0, 'starfield.star.small-1'),
                this.game.make.sprite(0, 0, 'starfield.star.small-2'),
                this.game.make.sprite(0, 0, 'starfield.star.small-3')
            ],
            slow: [
                this.game.make.sprite(0, 0, 'starfield.star.big-1'),
                this.game.make.sprite(0, 0, 'starfield.star.big-2'),
                this.game.make.sprite(0, 0, 'starfield.star.big-3')
            ]
        };
    }

    function createStars(numberOfStars) {
        var star, i; 
        for (i = 0; i < numberOfStars; i += 1) {
            star = this.craeteStar();
            this.addSpaceObject(star);
        };

    }

    function createStar() {
        var z = getRandomizedZ();
        var sprite = getSpriteFromZ(z);
        var star = new Star()
            .setX(Util.rnd(0, width))
            .setY(Util.rnd(0, height))
            .setZ(z)
            .setSprite(sprite);

        return star;
    }

    function getRandomizedZ() {
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
        return z;
    }

    function getSpriteFromZ(z) {
        var index = Util.rnd(0, 3),
            key = 'slow',
            sprites = ns.cache.starfield.stars;

        if (z >= 0.34 && z <= 0.65) {
            key = 'mediate';
        } else if (z > 0.65) {
            key = 'fast';
        }
        if (!sprites[key] || !sprites[key][index]) {
            throw 'Invalid sprite was given for a Star object!';
        }
        return sprites[key][index];
    }

    return StarGenerator;
});
// ************************************************************************************************
//                                   DeepCloudGenerator 
// ************************************************************************************************
define('Starfield.DeepCloudGenerator', [
    'Starfield.SpaceObject',
    'Starfield.SpaceObjectGenerator'
    'Util'
], function(Star, SpaceObjectGenerator, Util) {

    var DENSITY = 5;
    var ns = window.fivenations;
    var width = ns.window.width;
    var height = ns.window.height;
    var sprites;

    function DeepCloudGenerator(game) {
        SpaceObjectGenerator.call(this, game);
        createSprites.call(this);
        createClouds.call(this)
    }

    DeepCloudGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
    DeepCloudGenerator.prototype.constructor = DeepCloudGenerator;

    function createSprites() {

        if (sprites) return;

        sprites = {
            type1: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-1'),
            type2: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-2')
        };
    }

    function createClouds(savedData) {
        var numberOfClouds = DENSITY;
        if (!savedData){
            for (var i = 0; i < numberOfStars; i += 1) {
                cloud = this.createRandomizedCloud();
                this.addSpaceObject(cloud);
            };
        }
    }

    function createRandomizedCloud() {
        var z = getRandomizedZ();
        var cloud;

        cloud = new SpaceObject()
            .setX(Util.rnd(0, width))
            .setY(Util.rnd(0, height))
            .setZ(z)
            .setSprite(getRandomizedSprite());

        return cloud;
    }

    function getRandomizedZ() {
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
        return z;
    }

    function getRandomizedSprite() {
        var type = Util.rnd(1, 2);
        return getSpriteByType(type);
    }

    function createCloud(x, y, type) {
        var cloud = new SpaceObject()
            .setX(x)
            .setY(y)
            .setZ(z)
            .setSprite(getSpriteByType(type));

        return cloud;
    }

    function getSpriteByType(type) {
        if (!type) throw 'Invalid type was given to fetch sprite!';
        return sprites['type' + type];   
    }

    return DeepCloudGenerator;
});
// ************************************************************************************************
//                                              DeepSpaceLayer 
// ************************************************************************************************
define('Starfield.DeepSpaceLayer', ['Graphics', 'Starfield.StarGenerator'], function(Graphics, StarGenerator) {

    var ns = window.fivenations,
        width = ns.window.width,
        height = ns.window.height,
        i, l, clearLayer;

    function DeepSpaceLayer(game) {
        this.createTexture(game);
        this.generateSpaceObjects(new StarGenerator(game));
    }


    DeepSpaceLayer.prototype = {

        spaceObjects: [],

        createTexture: function(game) {
            var container;
            
            this.texture = game.add.renderTexture(width, height, 'Starfield.Stars.Texture');

            container = game.add.image(0, 0, this.texture);
            container.fixedToCamera = true;

            Graphics
                .getInstance()
                .getGroup('starfield')
                .add(container);
        },

        generateSpaceObjects: function(generator) {
            if (!generator) throw 'Invalid generator is passed!';
            var spaceObjects = generator.getSpaceOjbects();
            spaceObjects.forEach(function(so) {
                this.addSpaceObject(so);
            }.bind(this));
        },

        addSpaceObject: function(spaceObject) {
            if (!spaceObject) return;
            this.spaceObject.push(spaceObject);
        },

        update: function() {
            for (i = 0, l = this.spaceObjects.length; i < l; i += 1) {
                clearLayer = i === 0;
                this.spaceObjects[i].update(this.texture, game, clearLayer);
            }
        }

    }

    return DeepSpaceLayer;
});
// ************************************************************************************************
// 												Background 
// ************************************************************************************************
define('Starfield.Background', ['Graphics'], function(Graphics) {

    var BACKGROUND_SPEED = 0.1;

    function Background(game) {
        initialise.call(this, game);
    }

    function initialise(game) {
        this.game = game;
        this.background = game.add.tileSprite(0, 0, 1024, 1024, 'starfield');
        this.background.fixedToCamera = true;

        Graphics.getInstance().getGroup('starfield').add(this.background);
    }

    Background.prototype = {

        update: function() {
            this.background.tilePosition.x = -this.game.camera.x * BACKGROUND_SPEED;
            this.background.tilePosition.y = -this.game.camera.y * BACKGROUND_SPEED;
        }

    };

    return Background;
});
// ************************************************************************************************
// 												Starfield 
// ************************************************************************************************
define('Starfield', ['Starfield.DeepSpaceLayer', 'Starfield.Background'], function(DeepSpaceLayer, Background) {

    function Starfield(map) {
        initialise.call(this, map);
    }

    function initialise(map) {
        this.initLayers();
        this.createBackground(map.getGame());
        this.createDeepSpaceObjects(map.getGame());
    }

    Starfield.prototype = {

        initLayers: function() {
            this.layers = [];
        },

        createBackground: function(game) {
            this.layers.push(new Background(game));
        },        

        createDeepSpaceObjects: function(game) {
            this.layers.push(new DeepSpaceLayer(game));
        },

        update: function() {

            this.layers.forEach(function(layer) {
                layer.update();
            });

        }

    };

    return Starfield;
});