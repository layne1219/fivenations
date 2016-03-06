define('Preloader.Entities', function() {
'use strict';

    var ns = window.fivenations;

    // const like object to describe all the entities participating in the gameplay 
    ns.entities = ns.entities || {

        hurricane: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit01_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit01_c01.json',
            dataURL: 'assets/datas/units/fed/hurricane.json'
        },
        orca: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit02_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit02_c01.json',
            dataURL: 'assets/datas/units/fed/orca.json'
        },
        hailstorm: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit03_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit03_c01.json',
            dataURL: 'assets/datas/units/fed/hailstorm.json'
        },
        stgeorge: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit04_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit04_c01.json',
            dataURL: 'assets/datas/units/fed/stgeorge.json'
        },
        avenger: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit05_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit05_c01.json',
            dataURL: 'assets/datas/units/fed/avenger.json'
        },
        avenger2: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit06_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit06_c01.json',
            dataURL: 'assets/datas/units/fed/avenger2.json'
        },
        icarus: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit07_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit07_c01.json',
            dataURL: 'assets/datas/units/fed/icarus.json'
        },
        engineershuttle: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit08_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit08_c01.json',
            dataURL: 'assets/datas/units/fed/engineershuttle.json'
        },
        kutuzov: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit09_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit09_c01.json',
            dataURL: 'assets/datas/units/fed/kutuzov.json'
        },
        pasteur: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit10_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit10_c01.json',
            dataURL: 'assets/datas/units/fed/pasteur.json'
        },
        dresda: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit11_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit11_c01.json',
            dataURL: 'assets/datas/units/fed/dresda.json'
        },
        crow: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit12_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit12_c01.json',
            dataURL: 'assets/datas/units/fed/crow.json'
        },
        teller: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit13_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit13_c01.json',
            dataURL: 'assets/datas/units/fed/teller.json'
        },
        nuclearmissile: {
            preloading: true,
            spriteURL: 'assets/images/units/fed/fed_unit14_c{color}.png',
            atlasURL: 'assets/images/units/fed/fed_unit14_c01.json',
            dataURL: 'assets/datas/units/fed/nuclearmissile.json'
        }
                                                      
    };

    return {

        /**
         * Loading all the correspondant resources for the entities listed in the private *entities* object
         * @param {object} [preloader] Preloader object defined below
         * @return {void}
         */
        load: function(preloader){

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
    }

});
