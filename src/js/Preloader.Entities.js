define('Preloader.Entities', function() {
    'use strict';

    var ns = window.fivenations,
        PATH_ASSETS_DATA_UNITS = 'assets/datas/units';
        PATH_ASSETS_IMG_UNITS = 'assets/images/units';

    // const like object to describe all the entities participating in the gameplay 
    ns.entities = ns.entities || {

        hurricane: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit01.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit01.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/hurricane.json'
        },
        orca: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit02.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit02.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/orca.json'
        },
        hailstorm: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit03.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit03.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/hailstorm.json'
        },
        stgeorge: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit04.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit04.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/stgeorge.json'
        },
        avenger: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit05.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit05.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/avenger.json'
        },
        avenger2: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit06.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit06.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/avenger2.json'
        },
        icarus: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit07.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit07.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/icarus.json'
        },
        engineershuttle: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit08.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit08.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/engineershuttle.json'
        },
        kutuzov: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit09.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit09.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/kutuzov.json'
        },
        pasteur: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit10.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit10.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/pasteur.json'
        },
        dresda: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit11.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit11.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/dresda.json'
        },
        crow: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit12.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit12.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/crow.json'
        },
        teller: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit13.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit13.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/teller.json'
        },
        nuclearmissile: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit14.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_unit14.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/nuclearmissile.json'
        },
        commandcenter: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build01.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build01.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/commandcenter.json'
        },
        miningstation: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build02.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build02.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/miningstation.json'
        },
        civilianbase: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build03.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build03.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/civilianbase.json'
        },
        solarstation: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build04.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build04.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/solarstation.json'
        },
        shipfactory: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build05.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build05.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/shipfactory.json'
        },
        dockyard: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build06.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build06.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/dockyard.json'
        },
        merchantport: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build07.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build07.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/merchantport.json'
        },
        researchcenter: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build08.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build08.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/researchcenter.json'
        },
        astrometricstation: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build09.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build09.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/astrometricstation.json'
        },
        fleetheadquarters: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build10.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build10.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/fleetheadquarters.json'
        },
        defensesatellite: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build11.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build11.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/defensesatellite.json'
        },
        defenseplatform: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build12.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build12.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/defenseplatform.json'
        },
        fusionreactor: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build13.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/fed/fed_build13.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/fed/fusionreactor.json'
        },
        intruder: {
            preloading: true,
            spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit01.png',
            atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit01.json',
            dataURL: PATH_ASSETS_DATA_UNITS + '/ath/intruder.json'
        }        

    };

    return {

        /**
         * Loading all the correspondant resources for the entities listed in the private *entities* object
         * @param {object} [preloader] Preloader object defined below
         * @return {void}
         */
        load: function(preloader) {

            Object.keys(ns.entities).forEach(function(key) {

                if (!ns.entities[key].preloading) {
                    return;
                }

                preloader.load.atlasJSONHash(key, ns.entities[key].spriteURL, ns.entities[key].atlasURL);
                preloader.load.json(key, ns.entities[key].dataURL);
                
            }, preloader);

        }
    }

});