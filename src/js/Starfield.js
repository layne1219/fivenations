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
// 												StarLayer 
// ************************************************************************************************
define('Starfield.StarGenerator', [
    'Starfield.Star', 
    'Util'
], function(Star, Util) {

    var NUMBER_OF_STARS_PER_SCREEN = 10, 

        ns = window.fivenations,
        width = ns.window.width,
        height = ns.window.height;


    function StarGenerator(game) {
        createSprites.call(this, game);
        createStars.call(this, NUMBER_OF_STARS_PER_SCREEN)
    }


    function createSprites(game) {
        if (ns.cache.starfield) {
            return;
        }

        ns.cache.starfield = {};
        ns.cache.starfield.sprites = {
            'mediate': [
                game.make.sprite(0, 0, 'starfield.star.small-1'),
                game.make.sprite(0, 0, 'starfield.star.small-2'),
                game.make.sprite(0, 0, 'starfield.star.small-3')
            ],
            'slow': [
                game.make.sprite(0, 0, 'starfield.star.big-1'),
                game.make.sprite(0, 0, 'starfield.star.big-2'),
                game.make.sprite(0, 0, 'starfield.star.big-3')
            ]
        };
    }

    function createStars(numberOfStars) {

        this.stars = [];

        for (var i = 0; i < numberOfStars; i += 1) {
            addStar.call(this);
        };

        this.stars.sort(function(a, b) {
            return b.z - a.z;
        });
    }

    function addStar() {
        var z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6),
            sprite = getSpriteFromZ(z),

            star = new Star().setX(Util.rnd(0, width))
            .setY(Util.rnd(0, height))
            .setZ(z)
            .setSprite(sprite);

        this.stars.push(star);
    }

    function getSpriteFromZ(z) {
        var index = Util.rnd(0, 3),
            key = 'slow',
            sprites = ns.cache.starfield.sprites;

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

    StarLayer.prototype = {

        getSpaceOjbects: function() {
            return this.stars;
        }

    };

    return StarLayer;
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

    function Background(game, group) {
        initialise.call(this, game, group);
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