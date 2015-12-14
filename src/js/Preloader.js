define("Preloader", function() {
'use strict';

    var preloader;

    function Preloader() {
        this.ready = false;
    }

    Preloader.prototype = {
        preload: function () {
          preloader = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
          this.load.setPreloadSprite(preloader);

          this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
          this.loadResources();

        },

        loadResources: function () {
          
            // ----------------------------------------------------------------------------------
            // Starfield
            // ----------------------------------------------------------------------------------
            this.load.image('starfield', 'assets/images/starfield.jpg');
            this.load.image('starfield.star.slow-1', 'assets/images/star-s-1.png');
            this.load.image('starfield.star.slow-2', 'assets/images/star-s-2.png');
            this.load.image('starfield.star.slow-3', 'assets/images/star-s-3.png');
            this.load.image('starfield.star.mediate-1', 'assets/images/star-m-1.png');
            this.load.image('starfield.star.mediate-2', 'assets/images/star-m-2.png');
            this.load.image('starfield.star.mediate-3', 'assets/images/star-m-3.png');
            this.load.image('starfield.star.fast-1', 'assets/images/star-f-1.png');
            this.load.image('starfield.star.fast-2', 'assets/images/star-f-1.png');
            this.load.image('starfield.star.fast-3', 'assets/images/star-f-1.png');

            // ----------------------------------------------------------------------------------
            // Human spacecrafts
            // ----------------------------------------------------------------------------------            
            this.load.spritesheet('test-ship', 'assets/images/ship.png', 64, 64, 24);
            this.load.atlasJSONHash('hurricane', 'assets/images/units/fed/fed_unit01_c01.png', 'assets/images/units/fed/fed_unit01_c01.json');

        },

        create: function () {

        },

        update: function () {
          if (!!this.ready) {
            this.game.state.start('menu');
          }
        },

        onLoadComplete: function () {
          this.ready = true;
        }
    };

return Preloader;
});
