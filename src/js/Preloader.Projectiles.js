define('Preloader.Projectiles', function() {
    'use strict';

    var ns = window.fivenations;
    var PATH_ASSETS_DATA = 'assets/datas/projectiles';
    var PATH_ASSETS_IMG = 'assets/images/projectiles';

    // const like object to describe all the effects participating in the gameplay 
    ns.projectiles = Object.assign(ns.projectiles || {}, {

        'laser-beam-1': {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG + '/weapon_beams.png',
            atlasURL: PATH_ASSETS_IMG + '/weapon_beams.json',
            dataURL: PATH_ASSETS_DATA + '/laser-beam-1.json'
        }

    });

    return {

        /**
         * Loading all the correspondant resources for the effects listed in the private *effects* object
         * @param {object} [preloader] Preloader object defined below
         * @return {void}
         */
        load: function(preloader) {

            var loaded = {};

            Object.keys(ns.projectiles).forEach(function(key) {

                if (!ns.projectiles[key].preloading) {
                    return;
                }

                if (!loaded[ns.projectiles[key].spriteURL]) {
                    preloader.load.atlasJSONHash(key, ns.projectiles[key].spriteURL, ns.projectiles[key].atlasURL);
                }

                if (!loaded[ns.projectiles[key].dataURL]) {
                    preloader.load.json(key, ns.projectiles[key].dataURL);
                }

                loaded[ns.projectiles[key].spriteURL] = true;
                loaded[ns.projectiles[key].dataURL] = true;
                
            }, preloader);

        }
    }

});