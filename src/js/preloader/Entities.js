const ns = window.fivenations;
const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS_DATA = `${PUBLIC_URL}/assets/datas/units/`;
const PATH_ASSETS_IMG = `${PUBLIC_URL}/assets/images/units/`;

// const like object to describe all the entities participating in the gameplay 
ns.entities = ns.entities || {

    // ----------------------------------------------------------------------------
    // FEDERATION
    // ----------------------------------------------------------------------------
    hurricane: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit01.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit01.json',
        dataURL: PATH_ASSETS_DATA + 'fed/hurricane.json'
    },
    orca: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit02.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit02.json',
        dataURL: PATH_ASSETS_DATA + 'fed/orca.json'
    },
    hailstorm: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit03.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit03.json',
        dataURL: PATH_ASSETS_DATA + 'fed/hailstorm.json'
    },
    'hailstorm-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/hailstorm-wreckage.json'
    },    
    stgeorge: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit04.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit04.json',
        dataURL: PATH_ASSETS_DATA + 'fed/stgeorge.json'
    },
    'stgeorge-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/stgeorge-wreckage.json'
    },     
    avenger: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit05.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit05.json',
        dataURL: PATH_ASSETS_DATA + 'fed/avenger.json'
    },
    'avenger-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/avenger-wreckage.json'
    },     
    avenger2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit06.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit06.json',
        dataURL: PATH_ASSETS_DATA + 'fed/avenger2.json'
    },
    'avenger2-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/avenger2-wreckage.json'
    },    
    icarus: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit07.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit07.json',
        dataURL: PATH_ASSETS_DATA + 'fed/icarus.json'
    },
    'icarus-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/icarus-wreckage.json'
    },    
    engineershuttle: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit08.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit08.json',
        dataURL: PATH_ASSETS_DATA + 'fed/engineershuttle.json'
    },
    kutuzov: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit09.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit09.json',
        dataURL: PATH_ASSETS_DATA + 'fed/kutuzov.json'
    },
    'kutuzov-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/kutuzov-wreckage.json'
    },    
    pasteur: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit10.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit10.json',
        dataURL: PATH_ASSETS_DATA + 'fed/pasteur.json'
    },
    'pasteur-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/pasteur-wreckage.json'
    },    
    dresda: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit11.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit11.json',
        dataURL: PATH_ASSETS_DATA + 'fed/dresda.json'
    },
    'dresda-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/dresda-wreckage.json'
    },    
    crow: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit12.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit12.json',
        dataURL: PATH_ASSETS_DATA + 'fed/crow.json'
    },
    teller: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/teller.json'
    },
    'teller-wreckage': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unitandbuilding_wreckages.json',
        dataURL: PATH_ASSETS_DATA + 'fed/teller-wreckage.json'
    },    
    nuclearmissile: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_unit14.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_unit14.json',
        dataURL: PATH_ASSETS_DATA + 'fed/nuclearmissile.json'
    },
    commandcenter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build01.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build01.json',
        dataURL: PATH_ASSETS_DATA + 'fed/commandcenter.json'
    },
    miningstation: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build02.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build02.json',
        dataURL: PATH_ASSETS_DATA + 'fed/miningstation.json'
    },
    civilianbase: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build03.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build03.json',
        dataURL: PATH_ASSETS_DATA + 'fed/civilianbase.json'
    },
    solarstation: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build04.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build04.json',
        dataURL: PATH_ASSETS_DATA + 'fed/solarstation.json'
    },
    shipfactory: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build05.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build05.json',
        dataURL: PATH_ASSETS_DATA + 'fed/shipfactory.json'
    },
    dockyard: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build06.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build06.json',
        dataURL: PATH_ASSETS_DATA + 'fed/dockyard.json'
    },
    merchantport: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build07.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build07.json',
        dataURL: PATH_ASSETS_DATA + 'fed/merchantport.json'
    },
    researchcenter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build08.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build08.json',
        dataURL: PATH_ASSETS_DATA + 'fed/researchcenter.json'
    },
    astrometricstation: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build09.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build09.json',
        dataURL: PATH_ASSETS_DATA + 'fed/astrometricstation.json'
    },
    fleetheadquarters: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build10.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build10.json',
        dataURL: PATH_ASSETS_DATA + 'fed/fleetheadquarters.json'
    },
    defensesatellite: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build11.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build11.json',
        dataURL: PATH_ASSETS_DATA + 'fed/defensesatellite.json'
    },
    defenseplatform: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build12.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build12.json',
        dataURL: PATH_ASSETS_DATA + 'fed/defenseplatform.json'
    },
    fusionreactor: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'fed/fed_build13.png',
        atlasURL: PATH_ASSETS_IMG + 'fed/fed_build13.json',
        dataURL: PATH_ASSETS_DATA + 'fed/fusionreactor.json'
    },
/*
    // ----------------------------------------------------------------------------
    // ATHRAELS
    // ----------------------------------------------------------------------------
    intruder: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit01.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit01.json',
        dataURL: PATH_ASSETS_DATA + 'ath/intruder.json'
    },
    warpglider: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit02.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit02.json',
        dataURL: PATH_ASSETS_DATA + 'ath/warpglider.json'
    },
    flanker: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit03.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit03.json',
        dataURL: PATH_ASSETS_DATA + 'ath/flanker.json'
    },
    mothership: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit04.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit04.json',
        dataURL: PATH_ASSETS_DATA + 'ath/mothership.json'
    },
    invader: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit05.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit05.json',
        dataURL: PATH_ASSETS_DATA + 'ath/invader.json'
    },
    explorer: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit06.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit06.json',
        dataURL: PATH_ASSETS_DATA + 'ath/explorer.json'
    },
    drone: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit07.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit07.json',
        dataURL: PATH_ASSETS_DATA + 'ath/drone.json'
    },
    gathering: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit08.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit08.json',
        dataURL: PATH_ASSETS_DATA + 'ath/gathering.json'
    },
    clairvoyant: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit09.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit09.json',
        dataURL: PATH_ASSETS_DATA + 'ath/clairvoyant.json'
    },
    lancet: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit10.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit10.json',
        dataURL: PATH_ASSETS_DATA + 'ath/lancet.json'
    },
    theocrat: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit11.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit11.json',
        dataURL: PATH_ASSETS_DATA + 'ath/theocrat.json'
    },
    lifevessel: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit12.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit12.json',
        dataURL: PATH_ASSETS_DATA + 'ath/lifevessel.json'
    },
    rector: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_unit13.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_unit13.json',
        dataURL: PATH_ASSETS_DATA + 'ath/rector.json'
    },
    centralpyramid: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build01.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build01.json',
        dataURL: PATH_ASSETS_DATA + 'ath/centralpyramid.json'
    },        
    masstransmitter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build02.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build02.json',
        dataURL: PATH_ASSETS_DATA + 'ath/masstransmitter.json'
    },        
    biosphere: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build03.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build03.json',
        dataURL: PATH_ASSETS_DATA + 'ath/biosphere.json'
    },        
    powercore: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build04.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build04.json',
        dataURL: PATH_ASSETS_DATA + 'ath/powercore.json'
    },        
    polaronsphere: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build05.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build05.json',
        dataURL: PATH_ASSETS_DATA + 'ath/polaronsphere.json'
    },        
    obelisk: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build06.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build06.json',
        dataURL: PATH_ASSETS_DATA + 'ath/obelisk.json'
    },        
    sanctuary: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build07.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build07.json',
        dataURL: PATH_ASSETS_DATA + 'ath/sanctuary.json'
    },        
    synodum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build08.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build08.json',
        dataURL: PATH_ASSETS_DATA + 'ath/synodum.json'
    },        
    conservatory: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build09.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build09.json',
        dataURL: PATH_ASSETS_DATA + 'ath/conservatory.json'
    },        
    monumentofwill: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build10.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build10.json',
        dataURL: PATH_ASSETS_DATA + 'ath/monumentofwill.json'
    },        
    basilica: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build11.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build11.json',
        dataURL: PATH_ASSETS_DATA + 'ath/basilica.json'
    },        
    theocratsseat: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build12.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build12.json',
        dataURL: PATH_ASSETS_DATA + 'ath/theocratsseat.json'
    },        
    shieldgenerator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ath/ath_build13.png',
        atlasURL: PATH_ASSETS_IMG + 'ath/ath_build13.json',
        dataURL: PATH_ASSETS_DATA + 'ath/shieldgenerator.json'
    },

    // ----------------------------------------------------------------------------
    // SYL
    // ----------------------------------------------------------------------------
    spear: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit01.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit01.json',
        dataURL: PATH_ASSETS_DATA + 'syl/spear.json'
    },

    twinblade: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit02.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit02.json',
        dataURL: PATH_ASSETS_DATA + 'syl/twinblade.json'
    },

    gloom: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit03.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit03.json',
        dataURL: PATH_ASSETS_DATA + 'syl/gloom.json'
    },

    eclipse: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit04.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit04.json',
        dataURL: PATH_ASSETS_DATA + 'syl/eclipse.json'
    },

    shade: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit05.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit05.json',
        dataURL: PATH_ASSETS_DATA + 'syl/shade.json'
    },

    plasmaraid: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit06.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit06.json',
        dataURL: PATH_ASSETS_DATA + 'syl/plasmaraid.json'
    },

    hauler: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit07.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit07.json',
        dataURL: PATH_ASSETS_DATA + 'syl/hauler.json'
    },

    labor: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit08.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit08.json',
        dataURL: PATH_ASSETS_DATA + 'syl/labor.json'
    },

    installator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit09.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit09.json',
        dataURL: PATH_ASSETS_DATA + 'syl/installator.json'
    },

    absorber: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit10.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit10.json',
        dataURL: PATH_ASSETS_DATA + 'syl/absorber.json'
    },

    assimilator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit11.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit11.json',
        dataURL: PATH_ASSETS_DATA + 'syl/assimilator.json'
    },

    mask: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit12.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit12.json',
        dataURL: PATH_ASSETS_DATA + 'syl/mask.json'
    },

    caldron: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit13.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit13.json',
        dataURL: PATH_ASSETS_DATA + 'syl/caldron.json'
    },

    leechmine: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_unit14.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_unit14.json',
        dataURL: PATH_ASSETS_DATA + 'syl/leechmine.json'
    },

    installationprime: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build01.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build01.json',
        dataURL: PATH_ASSETS_DATA + 'syl/installationprime.json'
    },

    refinery: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build02.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build02.json',
        dataURL: PATH_ASSETS_DATA + 'syl/refinery.json'
    },

    supportcenter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build03.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build03.json',
        dataURL: PATH_ASSETS_DATA + 'syl/supportcenter.json'
    },

    manufacture: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build04.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build04.json',
        dataURL: PATH_ASSETS_DATA + 'syl/manufacture.json'
    },

    advancedmanufacture: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build05.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build05.json',
        dataURL: PATH_ASSETS_DATA + 'syl/advancedmanufacture.json'
    },

    manufactureprime: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build06.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build06.json',
        dataURL: PATH_ASSETS_DATA + 'syl/manufactureprime.json'
    },

    defensiveserver: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build07.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build07.json',
        dataURL: PATH_ASSETS_DATA + 'syl/defensiveserver.json'
    },

    offensiveserver: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build08.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build08.json',
        dataURL: PATH_ASSETS_DATA + 'syl/offensiveserver.json'
    },

    quantumcore: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build09.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build09.json',
        dataURL: PATH_ASSETS_DATA + 'syl/quantumcore.json'
    },

    aegis: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build10.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build10.json',
        dataURL: PATH_ASSETS_DATA + 'syl/aegis.json'
    },

    wormholegenerator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build11.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build11.json',
        dataURL: PATH_ASSETS_DATA + 'syl/wormholegenerator.json'
    },

    repairstation: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build12.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build12.json',
        dataURL: PATH_ASSETS_DATA + 'syl/repairstation.json'
    },

    supportcomplex: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'syl/syl_build13.png',
        atlasURL: PATH_ASSETS_IMG + 'syl/syl_build13.json',
        dataURL: PATH_ASSETS_DATA + 'syl/supportcomplex.json'
    },

    // ----------------------------------------------------------------------------
    // THO
    // ----------------------------------------------------------------------------
    predator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit01.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit01.json',
        dataURL: PATH_ASSETS_DATA + 'tho/predator.json'
    },

    maraduer: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit02.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit02.json',
        dataURL: PATH_ASSETS_DATA + 'tho/maraduer.json'
    },

    devastator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit03.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit03.json',
        dataURL: PATH_ASSETS_DATA + 'tho/devastator.json'
    },

    grinder: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit04.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit04.json',
        dataURL: PATH_ASSETS_DATA + 'tho/grinder.json'
    },

    vindicator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit05.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit05.json',
        dataURL: PATH_ASSETS_DATA + 'tho/vindicator.json'
    },

    flagship: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit06.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit06.json',
        dataURL: PATH_ASSETS_DATA + 'tho/flagship.json'
    },

    harvester: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit07.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit07.json',
        dataURL: PATH_ASSETS_DATA + 'tho/harvester.json'
    },

    welder: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit08.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit08.json',
        dataURL: PATH_ASSETS_DATA + 'tho/welder.json'
    },

    hunter: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit09.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit09.json',
        dataURL: PATH_ASSETS_DATA + 'tho/hunter.json'
    },

    corsair: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit10.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit10.json',
        dataURL: PATH_ASSETS_DATA + 'tho/corsair.json'
    },

    havoc: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit11.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit11.json',
        dataURL: PATH_ASSETS_DATA + 'tho/havoc.json'
    },

    breaker: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit12.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit12.json',
        dataURL: PATH_ASSETS_DATA + 'tho/breaker.json'
    },

    vanguard: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_unit13.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_unit13.json',
        dataURL: PATH_ASSETS_DATA + 'tho/vanguard.json'
    },

    capitol: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build01.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build01.json',
        dataURL: PATH_ASSETS_DATA + 'tho/capitol.json'
    },

    materialsilo: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build02.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build02.json',
        dataURL: PATH_ASSETS_DATA + 'tho/materialsilo.json'
    },

    habitat: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build03.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build03.json',
        dataURL: PATH_ASSETS_DATA + 'tho/habitat.json'
    },

    powerplant: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build04.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build04.json',
        dataURL: PATH_ASSETS_DATA + 'tho/powerplant.json'
    },

    energystorage: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build05.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build05.json',
        dataURL: PATH_ASSETS_DATA + 'tho/energystorage.json'
    },

    hall: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build06.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build06.json',
        dataURL: PATH_ASSETS_DATA + 'tho/hall.json'
    },

    flagshipyard: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build07.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build07.json',
        dataURL: PATH_ASSETS_DATA + 'tho/flagshipyard.json'
    },

    forum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build08.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build08.json',
        dataURL: PATH_ASSETS_DATA + 'tho/forum.json'
    },

    skycourt: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build09.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build09.json',
        dataURL: PATH_ASSETS_DATA + 'tho/skycourt.json'
    },

    senate: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build10.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build10.json',
        dataURL: PATH_ASSETS_DATA + 'tho/senate.json'
    },

    guardstation: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build11.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build11.json',
        dataURL: PATH_ASSETS_DATA + 'tho/guardstation.json'
    },

    provincialbeacon: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build12.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build12.json',
        dataURL: PATH_ASSETS_DATA + 'tho/provincialbeacon.json'
    },

    ioncannon: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'tho/tho_build13.png',
        atlasURL: PATH_ASSETS_IMG + 'tho/tho_build13.json',
        dataURL: PATH_ASSETS_DATA + 'tho/ioncannon.json'
    },

    // ----------------------------------------------------------------------------
    // ZHO
    // ----------------------------------------------------------------------------
    spawn: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit01.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit01.json',
        dataURL: PATH_ASSETS_DATA + 'zho/spawn.json'
    },

    guard: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit02.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit02.json',
        dataURL: PATH_ASSETS_DATA + 'zho/guard.json'
    },

    venator: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit03.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit03.json',
        dataURL: PATH_ASSETS_DATA + 'zho/venator.json'
    },

    mind: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit04.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit04.json',
        dataURL: PATH_ASSETS_DATA + 'zho/mind.json'
    },

    overseer: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit05.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit05.json',
        dataURL: PATH_ASSETS_DATA + 'zho/overseer.json'
    },

    swarmmother: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit06.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit06.json',
        dataURL: PATH_ASSETS_DATA + 'zho/swarmmother.json'
    },

    spikeworm: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit07.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit07.json',
        dataURL: PATH_ASSETS_DATA + 'zho/spikeworm.json'
    },

    queen: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit08.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit08.json',
        dataURL: PATH_ASSETS_DATA + 'zho/queen.json'
    },

    ovum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit09.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit09.json',
        dataURL: PATH_ASSETS_DATA + 'zho/ovum.json'
    },

    mindovum: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit10.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit10.json',
        dataURL: PATH_ASSETS_DATA + 'zho/mindovum.json'
    },

    reincarnate: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit11.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit11.json',
        dataURL: PATH_ASSETS_DATA + 'zho/reincarnate.json'
    },

    worker: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit12.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit12.json',
        dataURL: PATH_ASSETS_DATA + 'zho/worker.json'
    },

    rictus: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit13.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit13.json',
        dataURL: PATH_ASSETS_DATA + 'zho/rictus.json'
    },

    mite: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit14.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit14.json',
        dataURL: PATH_ASSETS_DATA + 'zho/mite.json'
    },

    ruptor: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit15.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit15.json',
        dataURL: PATH_ASSETS_DATA + 'zho/ruptor.json'
    },

    decay: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_unit16.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_unit16.json',
        dataURL: PATH_ASSETS_DATA + 'zho/decay.json'
    },

    cropbed: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build01.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build01.json',
        dataURL: PATH_ASSETS_DATA + 'zho/cropbed.json'
    },

    nutrientcolony: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build02.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build02.json',
        dataURL: PATH_ASSETS_DATA + 'zho/nutrientcolony.json'
    },

    metabolist: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build03.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build03.json',
        dataURL: PATH_ASSETS_DATA + 'zho/metabolist.json'
    },

    agaric: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build04.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build04.json',
        dataURL: PATH_ASSETS_DATA + 'zho/agaric.json'
    },

    mindfungus: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build05.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build05.json',
        dataURL: PATH_ASSETS_DATA + 'zho/mindfungus.json'
    },

    clathruscolony: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build06.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build06.json',
        dataURL: PATH_ASSETS_DATA + 'zho/clathruscolony.json'
    },

    symbioticorgan: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build07.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build07.json',
        dataURL: PATH_ASSETS_DATA + 'zho/symbioticorgan.json'
    },

    evulatory: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build08.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build08.json',
        dataURL: PATH_ASSETS_DATA + 'zho/evulatory.json'
    },

    swarmmembrane: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build09.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build09.json',
        dataURL: PATH_ASSETS_DATA + 'zho/swarmmembrane.json'
    },

    chrysodendron: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build10.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build10.json',
        dataURL: PATH_ASSETS_DATA + 'zho/chrysodendron.json'
    },

    chimneyplant: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build11.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build11.json',
        dataURL: PATH_ASSETS_DATA + 'zho/chimneyplant.json'
    },

    decaychamber: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build12.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build12.json',
        dataURL: PATH_ASSETS_DATA + 'zho/decaychamber.json'
    },

    fonia: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build13.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build13.json',
        dataURL: PATH_ASSETS_DATA + 'zho/fonia.json'
    },

    seed: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'zho/zho_build14.png',
        atlasURL: PATH_ASSETS_IMG + 'zho/zho_build14.json',
        dataURL: PATH_ASSETS_DATA + 'zho/seed.json'
    },*/

    // ----------------------------------------------------------------------------
    // ASTEROIDS
    // ----------------------------------------------------------------------------
    asteroid1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroid1.json'            
    },
    asteroid2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroid2.json'            
    },
    asteroid3: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid03.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid03.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroid3.json'            
    },
    asteroid4: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid04.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid04.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroid4.json'            
    },
    asteroidbig1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_big01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_big01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidbig1.json'            
    },
    asteroidbig2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_big02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_big02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidbig2.json'            
    },        
    asteroidsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_sm01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_sm01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsmall1.json'            
    },
    asteroidsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_sm02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_sm02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsmall2.json'            
    },
    asteroidsmall3: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_sm03.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_sm03.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsmall3.json'            
    },
    asteroidsmall4: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_sm04.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_sm04.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsmall4.json'            
    },
    asteroidice1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_ice01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_ice01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidice1.json'            
    },
    asteroidice2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_ice01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_ice01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidice2.json'            
    },
    asteroidicesmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_ice_sm01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_ice_sm01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidice1.json'            
    },
    asteroidicesmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_ice_sm02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_ice_sm02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidice2.json'            
    },
    asteroidsilicon1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsilicon1.json'            
    },
    asteroidsilicon2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsilicon2.json'            
    },
    asteroidsiliconsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon_sm01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon_sm01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsiliconsmall1.json'            
    },
    asteroidsiliconsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon_sm02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_silicon_sm02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidsiliconsmall2.json'            
    },                
    asteroidtitanium1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidtitanium1.json'            
    },
    asteroidtitanium2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidtitanium2.json'            
    },
    asteroidtitaniumsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium_sm01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium_sm01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidtitaniumsmall1.json'            
    },
    asteroidtitaniumsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium_sm02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_titanium_sm02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroidtitaniumsmall2.json'            
    },
    asteroiduranium1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroiduranium1.json'            
    },
    asteroiduranium2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroiduranium2.json'            
    },
    asteroiduraniumsmall1: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium_sm01.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium_sm01.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroiduraniumsmall1.json'            
    },
    asteroiduraniumsmall2: {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium_sm02.png',
        atlasURL: PATH_ASSETS_IMG + 'ast/asteroid_uranium_sm02.json',
        dataURL: PATH_ASSETS_DATA + 'ast/asteroiduraniumsmall2.json'            
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

            const spriteUrl = ns.entities[key].spriteURL;
            const atlasUrl = ns.entities[key].atlasURL;
            const dataUrl = ns.entities[key].dataURL;    

            preloader.load.atlasJSONHash(key, spriteUrl, atlasUrl);
            preloader.load.json(key, dataUrl);
            
        }, preloader);

    }
}
