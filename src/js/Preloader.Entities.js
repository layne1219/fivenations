define('Preloader.Entities', function() {
    'use strict';

    var ns = window.fivenations;

    // const like object to describe all the entities participating in the gameplay 
    ns.entities = ns.entities || {

        hurricane: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit01.png',
            atlasURL: 'assets/images/units/fed/fed_unit01.json',
            dataURL: 'assets/datas/units/fed/hurricane.json'
        },
        orca: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit02.png',
            atlasURL: 'assets/images/units/fed/fed_unit02.json',
            dataURL: 'assets/datas/units/fed/orca.json'
        },
        hailstorm: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit03.png',
            atlasURL: 'assets/images/units/fed/fed_unit03.json',
            dataURL: 'assets/datas/units/fed/hailstorm.json'
        },
        stgeorge: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit04.png',
            atlasURL: 'assets/images/units/fed/fed_unit04.json',
            dataURL: 'assets/datas/units/fed/stgeorge.json'
        },
        avenger: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit05.png',
            atlasURL: 'assets/images/units/fed/fed_unit05.json',
            dataURL: 'assets/datas/units/fed/avenger.json'
        },
        avenger2: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit06.png',
            atlasURL: 'assets/images/units/fed/fed_unit06.json',
            dataURL: 'assets/datas/units/fed/avenger2.json'
        },
        icarus: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit07.png',
            atlasURL: 'assets/images/units/fed/fed_unit07.json',
            dataURL: 'assets/datas/units/fed/icarus.json'
        },
        engineershuttle: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit08.png',
            atlasURL: 'assets/images/units/fed/fed_unit08.json',
            dataURL: 'assets/datas/units/fed/engineershuttle.json'
        },
        kutuzov: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit09.png',
            atlasURL: 'assets/images/units/fed/fed_unit09.json',
            dataURL: 'assets/datas/units/fed/kutuzov.json'
        },
        pasteur: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit10.png',
            atlasURL: 'assets/images/units/fed/fed_unit10.json',
            dataURL: 'assets/datas/units/fed/pasteur.json'
        },
        dresda: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit11.png',
            atlasURL: 'assets/images/units/fed/fed_unit11.json',
            dataURL: 'assets/datas/units/fed/dresda.json'
        },
        crow: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit12.png',
            atlasURL: 'assets/images/units/fed/fed_unit12.json',
            dataURL: 'assets/datas/units/fed/crow.json'
        },
        teller: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit13.png',
            atlasURL: 'assets/images/units/fed/fed_unit13.json',
            dataURL: 'assets/datas/units/fed/teller.json'
        },
        nuclearmissile: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit14.png',
            atlasURL: 'assets/images/units/fed/fed_unit14.json',
            dataURL: 'assets/datas/units/fed/nuclearmissile.json'
        },
        commandcenter: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build01.png',
            atlasURL: 'assets/images/units/fed/fed_build01.json',
            dataURL: 'assets/datas/units/fed/commandcenter.json'
        },
        miningstation: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build02.png',
            atlasURL: 'assets/images/units/fed/fed_build02.json',
            dataURL: 'assets/datas/units/fed/miningstation.json'
        },
        civilianbase: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build03.png',
            atlasURL: 'assets/images/units/fed/fed_build03.json',
            dataURL: 'assets/datas/units/fed/civilianbase.json'
        },
        solarstation: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build04.png',
            atlasURL: 'assets/images/units/fed/fed_build04.json',
            dataURL: 'assets/datas/units/fed/solarstation.json'
        },
        shipfactory: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build05.png',
            atlasURL: 'assets/images/units/fed/fed_build05.json',
            dataURL: 'assets/datas/units/fed/shipfactory.json'
        },
        dockyard: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build06.png',
            atlasURL: 'assets/images/units/fed/fed_build06.json',
            dataURL: 'assets/datas/units/fed/dockyard.json'
        },
        merchantport: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build07.png',
            atlasURL: 'assets/images/units/fed/fed_build07.json',
            dataURL: 'assets/datas/units/fed/merchantport.json'
        },
        researchcenter: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build08.png',
            atlasURL: 'assets/images/units/fed/fed_build08.json',
            dataURL: 'assets/datas/units/fed/researchcenter.json'
        },
        astrometricstation: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build09.png',
            atlasURL: 'assets/images/units/fed/fed_build09.json',
            dataURL: 'assets/datas/units/fed/astrometricstation.json'
        },
        fleetheadquarters: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build10.png',
            atlasURL: 'assets/images/units/fed/fed_build10.json',
            dataURL: 'assets/datas/units/fed/fleetheadquarters.json'
        },
        defensesatellite: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build11.png',
            atlasURL: 'assets/images/units/fed/fed_build11.json',
            dataURL: 'assets/datas/units/fed/defensesatellite.json'
        },
        defenseplatform: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build12.png',
            atlasURL: 'assets/images/units/fed/fed_build12.json',
            dataURL: 'assets/datas/units/fed/defenseplatform.json'
        },
        fusionreactor: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_build13.png',
            atlasURL: 'assets/images/units/fed/fed_build13.json',
            dataURL: 'assets/datas/units/fed/fusionreactor.json'
        },
        intruder: {
            preloading: true,
            spriteURL: 'assets/images/units/ath/ath_unit01.png',
            atlasURL: 'assets/images/units/ath/ath_unit01.json',
            dataURL: 'assets/datas/units/ath/intruder.json'
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