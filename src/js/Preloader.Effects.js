define('Preloader.Effects', function() {
    'use strict';

    var ns = window.fivenations;
    var PATH_ASSETS_DATA = 'assets/datas/effects';
    var PATH_ASSETS_IMG = 'assets/images/effects';

    // const like object to describe all the effects participating in the gameplay 
    ns.effects = ns.effects || {

        'blow-1': {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG + '/effect_blow1.png',
            atlasURL: PATH_ASSETS_IMG + '/effect_blow1.json',
            dataURL: PATH_ASSETS_DATA + '/blow-1.json'
        }

    };

    return {

        /**
         * Loading all the correspondant resources for the effects listed in the private *effects* object
         * @param {object} [preloader] Preloader object defined below
         * @return {void}
         */
        load: function(preloader) {

            Object.keys(ns.effects).forEach(function(key) {

                if (!ns.effects[key].preloading) {
                    return;
                }

                preloader.load.atlasJSONHash(key, ns.effects[key].spriteURL, ns.effects[key].atlasURL);
                preloader.load.json(key, ns.effects[key].dataURL);
                
            }, preloader);

        }
    }

});