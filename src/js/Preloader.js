define("Preloader", function() {
'use strict';

    var preloader,
        ns = window.fivenations;

    // Entity details
    // const like object to describe all the entities participating in the gameplay 
    ns.entities = ns.entities || {
        hurricane: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit01_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit01_c01.json',
            dataURL: 'assets/datas/units/fed/hurricane.json'
        }
    };

    /**
     * Private function to set up all the assets needs to be loaded before the game starts
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    function loadResources(preloader) {
        loadGUI(preloader);
        loadStarfield(preloader);
        loadEntities(preloader);
    }

    /**
     * Loading assets for the in-game GUI
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    function loadGUI(preloader){
        preloader.load.atlasJSONHash('gui', 'assets/images/gui/GUI_element.png', 'assets/images/gui/GUI_element.json');
    }

    /**
     * Loading assets for the starfield object displaying the parallax background
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    function loadStarfield(preloader){
        preloader.load.image('starfield', 'assets/images/starfield/starfield.jpg');
        preloader.load.image('starfield.star.slow-1', 'assets/images/starfield/star-s-1.png');
        preloader.load.image('starfield.star.slow-2', 'assets/images/starfield/star-s-2.png');
        preloader.load.image('starfield.star.slow-3', 'assets/images/starfield/star-s-3.png');
        preloader.load.image('starfield.star.mediate-1', 'assets/images/starfield/star-m-1.png');
        preloader.load.image('starfield.star.mediate-2', 'assets/images/starfield/star-m-2.png');
        preloader.load.image('starfield.star.mediate-3', 'assets/images/starfield/star-m-3.png');
        preloader.load.image('starfield.star.fast-1', 'assets/images/starfield/star-f-1.png');
        preloader.load.image('starfield.star.fast-2', 'assets/images/starfield/star-f-1.png');
        preloader.load.image('starfield.star.fast-3', 'assets/images/starfield/star-f-1.png');        
    }

    /**
     * Loading all the correspondant resources for the entities listed in the private *entities* object
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    function loadEntities(preloader){

        Object.keys(ns.entities).forEach(function(key){
            var spriteURL,
                spriteKey,
                teamNumber = 8;

            if (!ns.entities[key].preloading){
                return;
            }

            for (var i = teamNumber; i >= 1; i--) {
                spriteURL = ns.entities[key].spriteURL.replace('{color}', i > 10 ? i : ('0' + i));
                spriteKey = [key, i].join('-');
                preloader.load.atlasJSONHash(spriteKey, spriteURL, ns.entities[key].atlasURL);
            }

            preloader.load.json(key, ns.entities[key].dataURL);   
        }, preloader); 

    }    


    /**
     * Preloader object used for asyncroniously download assets for the game
     */
    function Preloader() {
        this.ready = false;
    }

    Preloader.prototype = {
        /**
         * @return {void}
         */
        preload: function () {
          preloader = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
          this.load.setPreloadSprite(preloader);

          // setting up the callback one the preloading is completed
          this.load.onLoadComplete.addOnce(function(){
            this.ready = true;
          }, this);
          
          // line up all the reasources waiting for being preloaded
          loadResources(this);

        },

        /**
         * @return {void}
         */
        create: function () {

        },

        /**
         * @return {void}
         */
        update: function () {
          if (!!this.ready) {
            this.game.state.start('menu');
          }
        }

    };

return Preloader;
});
