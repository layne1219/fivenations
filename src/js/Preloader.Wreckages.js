define('Preloader.Wreckages', function() {
    'use strict';

    var ns = window.fivenations;
    var PATH_ASSETS_DATA_UNITS = 'assets/datas/units';
    var PATH_ASSETS_IMG_UNITS = 'assets/images/units';
    var NO_WRECKAGES_PER_NATION = 5;

    // const like object to describe all the wreckages participating in the gameplay 
    ns.wreckages = {};

    ['fed', 'ath', 'syl'].forEach(function(nation) {
        
        for (var i = 1; i <= NO_WRECKAGES_PER_NATION; i += 1) {
            ns.wreckages[nation + '-wreck-' + i] = {
                preloading: true,
                spriteURL: PATH_ASSETS_IMG_UNITS + '/' + nation + '/' + nation + '_wreck0' + i + '.png',
                atlasURL: PATH_ASSETS_IMG_UNITS + '/' + nation + '/' + nation + '_wreck0' + i + '.json',
                dataURL: PATH_ASSETS_DATA_UNITS + '/' + nation + '/' + nation + '-wreck-' + i + '.json'
            }
        }

    });

    return {

        /**
         * Loading all the correspondant resources for the wreckages listed in the private *wreckages* object
         * @param {object} [preloader] Preloader object defined below
         * @return {void}
         */
        load: function(preloader) {

            Object.keys(ns.wreckages).forEach(function(key) {

                if (!ns.wreckages[key].preloading) {
                    return;
                }

                preloader.load.atlasJSONHash(key, ns.wreckages[key].spriteURL, ns.wreckages[key].atlasURL);
                preloader.load.json(key, ns.wreckages[key].dataURL);
                
            }, preloader);

        }
    }

});