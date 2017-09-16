const ns = window.fivenations;
const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS_DATA_UNITS = `${PUBLIC_URL}/assets/datas/units`;
const PATH_ASSETS_IMG_UNITS = `${PUBLIC_URL}/assets/images/units`;

// const like object to describe all the entities participating in the gameplay 
ns.entities = ns.entities || {

    // ----------------------------------------------------------------------------
    // FEDERATION
    // ----------------------------------------------------------------------------
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

    // ----------------------------------------------------------------------------
    // ATHRAELS
    // ----------------------------------------------------------------------------
    intruder: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/intruder.json'
    },
    warpglider: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/warpglider.json'
    },
    flanker: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/flanker.json'
    },
    mothership: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/mothership.json'
    },
    invader: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/invader.json'
    },
    explorer: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/explorer.json'
    },
    drone: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/drone.json'
    },
    gathering: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit08.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit08.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/gathering.json'
    },
    clairvoyant: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/clairvoyant.json'
    },
    lancet: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/lancet.json'
    },
    theocrat: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/theocrat.json'
    },
    lifevessel: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/lifevessel.json'
    },
    rector: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_unit13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/rector.json'
    },
    centralpyramid: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/centralpyramid.json'
    },        
    masstransmitter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/masstransmitter.json'
    },        
    biosphere: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/biosphere.json'
    },        
    powercore: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/powercore.json'
    },        
    polaronsphere: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/polaronsphere.json'
    },        
    obelisk: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/obelisk.json'
    },        
    sanctuary: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/sanctuary.json'
    },        
    synodum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build08.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build08.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/synodum.json'
    },        
    conservatory: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/conservatory.json'
    },        
    monumentofwill: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/monumentofwill.json'
    },        
    basilica: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/basilica.json'
    },        
    theocratsseat: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/theocratsseat.json'
    },        
    shieldgenerator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ath/ath_build13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ath/shieldgenerator.json'
    },

    // ----------------------------------------------------------------------------
    // SYL
    // ----------------------------------------------------------------------------
    spear: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/spear.json'
    },

    twinblade: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/twinblade.json'
    },

    gloom: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/gloom.json'
    },

    eclipse: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/eclipse.json'
    },

    shade: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/shade.json'
    },

    plasmaraid: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/plasmaraid.json'
    },

    hauler: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/hauler.json'
    },

    labor: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit08.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit08.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/labor.json'
    },

    installator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/installator.json'
    },

    absorber: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/absorber.json'
    },

    assimilator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/assimilator.json'
    },

    mask: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/mask.json'
    },

    caldron: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/caldron.json'
    },

    leechmine: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit14.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_unit14.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/leechmine.json'
    },

    installationprime: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/installationprime.json'
    },

    refinery: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/refinery.json'
    },

    supportcenter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/supportcenter.json'
    },

    manufacture: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/manufacture.json'
    },

    advancedmanufacture: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/advancedmanufacture.json'
    },

    manufactureprime: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/manufactureprime.json'
    },

    defensiveserver: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/defensiveserver.json'
    },

    offensiveserver: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build08.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build08.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/offensiveserver.json'
    },

    quantumcore: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/quantumcore.json'
    },

    aegis: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/aegis.json'
    },

    wormholegenerator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/wormholegenerator.json'
    },

    repairstation: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/repairstation.json'
    },

    supportcomplex: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/syl/syl_build13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/syl/supportcomplex.json'
    },

    // ----------------------------------------------------------------------------
    // THO
    // ----------------------------------------------------------------------------
    predator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/predator.json'
    },

    maraduer: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/maraduer.json'
    },

    devastator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/devastator.json'
    },

    grinder: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/grinder.json'
    },

    vindicator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/vindicator.json'
    },

    flagship: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/flagship.json'
    },

    harvester: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/harvester.json'
    },

    welder: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit08.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit08.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/welder.json'
    },

    hunter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/hunter.json'
    },

    corsair: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/corsair.json'
    },

    havoc: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/havoc.json'
    },

    breaker: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/breaker.json'
    },

    vanguard: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_unit13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/vanguard.json'
    },

    capitol: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/capitol.json'
    },

    materialsilo: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/materialsilo.json'
    },

    habitat: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/habitat.json'
    },

    powerplant: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/powerplant.json'
    },

    energystorage: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/energystorage.json'
    },

    hall: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/hall.json'
    },

    flagshipyard: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/flagshipyard.json'
    },

    forum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build08.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build08.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/forum.json'
    },

    skycourt: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/skycourt.json'
    },

    senate: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/senate.json'
    },

    guardstation: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/guardstation.json'
    },

    provincialbeacon: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/provincialbeacon.json'
    },

    ioncannon: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/tho/tho_build13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/tho/ioncannon.json'
    },

    // ----------------------------------------------------------------------------
    // ZHO
    // ----------------------------------------------------------------------------
    spawn: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/spawn.json'
    },

    guard: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/guard.json'
    },

    venator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/venator.json'
    },

    mind: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/mind.json'
    },

    overseer: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/overseer.json'
    },

    swarmmother: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/swarmmother.json'
    },

    spikeworm: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/spikeworm.json'
    },

    queen: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit08_0.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit08_0.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/queen.json'
    },

    ovum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/ovum.json'
    },

    mindovum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/mindovum.json'
    },

    reincarnate: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/reincarnate.json'
    },

    worker: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/worker.json'
    },

    rictus: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/rictus.json'
    },

    mite: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit14.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit14.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/mite.json'
    },

    ruptor: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit15.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit15.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/ruptor.json'
    },

    decay: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit16.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_unit16.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/decay.json'
    },

    cropbed: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/cropbed.json'
    },

    nutrientcolony: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/nutrientcolony.json'
    },

    metabolist: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/metabolist.json'
    },

    agaric: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/agaric.json'
    },

    mindfungus: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build05.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build05.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/mindfungus.json'
    },

    clathruscolony: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build06.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build06.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/clathruscolony.json'
    },

    symbioticorgan: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build07.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build07.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/symbioticorgan.json'
    },

    evulatory: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build08.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build08.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/evulatory.json'
    },

    swarmmembrane: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build09.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build09.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/swarmmembrane.json'
    },

    chrysodendron: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build10.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build10.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/chrysodendron.json'
    },

    chimneyplant: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build11.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build11.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/chimneyplant.json'
    },

    decaychamber: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build12.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build12.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/decaychamber.json'
    },

    fonia: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build13.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build13.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/fonia.json'
    },

    seed: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build14.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/zho/zho_build14.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/zho/seed.json'
    },

    // ----------------------------------------------------------------------------
    // ASTEROIDS
    // ----------------------------------------------------------------------------
    asteroid1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroid1.json'            
    },
    asteroid2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroid2.json'            
    },
    asteroid3: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroid3.json'            
    },
    asteroid4: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroid4.json'            
    },
    asteroidbig1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_big01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_big01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidbig1.json'            
    },
    asteroidbig2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_big02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_big02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidbig2.json'            
    },        
    asteroidsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsmall1.json'            
    },
    asteroidsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsmall2.json'            
    },
    asteroidsmall3: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm03.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm03.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsmall3.json'            
    },
    asteroidsmall4: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm04.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_sm04.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsmall4.json'            
    },
    asteroidice1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidice1.json'            
    },
    asteroidice2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidice2.json'            
    },
    asteroidicesmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice_sm01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice_sm01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidice1.json'            
    },
    asteroidicesmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice_sm02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_ice_sm02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidice2.json'            
    },
    asteroidsilicon1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsilicon1.json'            
    },
    asteroidsilicon2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsilicon2.json'            
    },
    asteroidsiliconsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon_sm01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon_sm01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsiliconsmall1.json'            
    },
    asteroidsiliconsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon_sm02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_silicon_sm02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidsiliconsmall2.json'            
    },                
    asteroidtitanium1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidtitanium1.json'            
    },
    asteroidtitanium2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidtitanium2.json'            
    },
    asteroidtitaniumsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium_sm01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium_sm01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidtitaniumsmall1.json'            
    },
    asteroidtitaniumsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium_sm02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_titanium_sm02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroidtitaniumsmall2.json'            
    },
    asteroiduranium1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroiduranium1.json'            
    },
    asteroiduranium2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroiduranium2.json'            
    },
    asteroiduraniumsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium_sm01.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium_sm01.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroiduraniumsmall1.json'            
    },
    asteroiduraniumsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium_sm02.png',
        atlasURL: PATH_ASSETS_IMG_UNITS + '/ast/asteroid_uranium_sm02.json',
        dataURL: PATH_ASSETS_DATA_UNITS + '/ast/asteroiduraniumsmall2.json'            
    }
};

export default {

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
