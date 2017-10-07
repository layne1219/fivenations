const ns = window.fivenations;
const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS_DATA = `${PUBLIC_URL}/assets/datas/units`;
const PATH_ASSETS_IMG = `${PUBLIC_URL}/assets/images/units`;

// const like object to describe all the entities participating in the gameplay 
ns.entities = ns.entities || {

    // ----------------------------------------------------------------------------
    // FEDERATION
    // ----------------------------------------------------------------------------
    hurricane: {
        preloading: true,
        spriteURL: '/fed/fed_unit01.png',
        atlasURL: '/fed/fed_unit01.json',
        dataURL: '/fed/hurricane.json'
    },
    orca: {
        preloading: true,
        spriteURL: '/fed/fed_unit02.png',
        atlasURL: '/fed/fed_unit02.json',
        dataURL: '/fed/orca.json'
    },
    hailstorm: {
        preloading: true,
        spriteURL: '/fed/fed_unit03.png',
        atlasURL: '/fed/fed_unit03.json',
        dataURL: '/fed/hailstorm.json'
    },
    stgeorge: {
        preloading: true,
        spriteURL: '/fed/fed_unit04.png',
        atlasURL: '/fed/fed_unit04.json',
        dataURL: '/fed/stgeorge.json'
    },
    avenger: {
        preloading: true,
        spriteURL: '/fed/fed_unit05.png',
        atlasURL: '/fed/fed_unit05.json',
        dataURL: '/fed/avenger.json'
    },
    avenger2: {
        preloading: true,
        spriteURL: '/fed/fed_unit06.png',
        atlasURL: '/fed/fed_unit06.json',
        dataURL: '/fed/avenger2.json'
    },
    icarus: {
        preloading: true,
        spriteURL: '/fed/fed_unit07.png',
        atlasURL: '/fed/fed_unit07.json',
        dataURL: '/fed/icarus.json'
    },
    engineershuttle: {
        preloading: true,
        spriteURL: '/fed/fed_unit08.png',
        atlasURL: '/fed/fed_unit08.json',
        dataURL: '/fed/engineershuttle.json'
    },
    kutuzov: {
        preloading: true,
        spriteURL: '/fed/fed_unit09.png',
        atlasURL: '/fed/fed_unit09.json',
        dataURL: '/fed/kutuzov.json'
    },
    pasteur: {
        preloading: true,
        spriteURL: '/fed/fed_unit10.png',
        atlasURL: '/fed/fed_unit10.json',
        dataURL: '/fed/pasteur.json'
    },
    dresda: {
        preloading: true,
        spriteURL: '/fed/fed_unit11.png',
        atlasURL: '/fed/fed_unit11.json',
        dataURL: '/fed/dresda.json'
    },
    crow: {
        preloading: true,
        spriteURL: '/fed/fed_unit12.png',
        atlasURL: '/fed/fed_unit12.json',
        dataURL: '/fed/crow.json'
    },
    teller: {
        preloading: true,
        spriteURL: '/fed/fed_unit13.png',
        atlasURL: '/fed/fed_unit13.json',
        dataURL: '/fed/teller.json'
    },
    nuclearmissile: {
        preloading: true,
        spriteURL: '/fed/fed_unit14.png',
        atlasURL: '/fed/fed_unit14.json',
        dataURL: '/fed/nuclearmissile.json'
    },
    commandcenter: {
        preloading: true,
        spriteURL: '/fed/fed_build01.png',
        atlasURL: '/fed/fed_build01.json',
        dataURL: '/fed/commandcenter.json'
    },
    miningstation: {
        preloading: true,
        spriteURL: '/fed/fed_build02.png',
        atlasURL: '/fed/fed_build02.json',
        dataURL: '/fed/miningstation.json'
    },
    civilianbase: {
        preloading: true,
        spriteURL: '/fed/fed_build03.png',
        atlasURL: '/fed/fed_build03.json',
        dataURL: '/fed/civilianbase.json'
    },
    solarstation: {
        preloading: true,
        spriteURL: '/fed/fed_build04.png',
        atlasURL: '/fed/fed_build04.json',
        dataURL: '/fed/solarstation.json'
    },
    shipfactory: {
        preloading: true,
        spriteURL: '/fed/fed_build05.png',
        atlasURL: '/fed/fed_build05.json',
        dataURL: '/fed/shipfactory.json'
    },
    dockyard: {
        preloading: true,
        spriteURL: '/fed/fed_build06.png',
        atlasURL: '/fed/fed_build06.json',
        dataURL: '/fed/dockyard.json'
    },
    merchantport: {
        preloading: true,
        spriteURL: '/fed/fed_build07.png',
        atlasURL: '/fed/fed_build07.json',
        dataURL: '/fed/merchantport.json'
    },
    researchcenter: {
        preloading: true,
        spriteURL: '/fed/fed_build08.png',
        atlasURL: '/fed/fed_build08.json',
        dataURL: '/fed/researchcenter.json'
    },
    astrometricstation: {
        preloading: true,
        spriteURL: '/fed/fed_build09.png',
        atlasURL: '/fed/fed_build09.json',
        dataURL: '/fed/astrometricstation.json'
    },
    fleetheadquarters: {
        preloading: true,
        spriteURL: '/fed/fed_build10.png',
        atlasURL: '/fed/fed_build10.json',
        dataURL: '/fed/fleetheadquarters.json'
    },
    defensesatellite: {
        preloading: true,
        spriteURL: '/fed/fed_build11.png',
        atlasURL: '/fed/fed_build11.json',
        dataURL: '/fed/defensesatellite.json'
    },
    defenseplatform: {
        preloading: true,
        spriteURL: '/fed/fed_build12.png',
        atlasURL: '/fed/fed_build12.json',
        dataURL: '/fed/defenseplatform.json'
    },
    fusionreactor: {
        preloading: true,
        spriteURL: '/fed/fed_build13.png',
        atlasURL: '/fed/fed_build13.json',
        dataURL: '/fed/fusionreactor.json'
    },

    // ----------------------------------------------------------------------------
    // ATHRAELS
    // ----------------------------------------------------------------------------
    intruder: {
        preloading: true,
        spriteURL: '/ath/ath_unit01.png',
        atlasURL: '/ath/ath_unit01.json',
        dataURL: '/ath/intruder.json'
    },
    warpglider: {
        preloading: true,
        spriteURL: '/ath/ath_unit02.png',
        atlasURL: '/ath/ath_unit02.json',
        dataURL: '/ath/warpglider.json'
    },
    flanker: {
        preloading: true,
        spriteURL: '/ath/ath_unit03.png',
        atlasURL: '/ath/ath_unit03.json',
        dataURL: '/ath/flanker.json'
    },
    mothership: {
        preloading: true,
        spriteURL: '/ath/ath_unit04.png',
        atlasURL: '/ath/ath_unit04.json',
        dataURL: '/ath/mothership.json'
    },
    invader: {
        preloading: true,
        spriteURL: '/ath/ath_unit05.png',
        atlasURL: '/ath/ath_unit05.json',
        dataURL: '/ath/invader.json'
    },
    explorer: {
        preloading: true,
        spriteURL: '/ath/ath_unit06.png',
        atlasURL: '/ath/ath_unit06.json',
        dataURL: '/ath/explorer.json'
    },
    drone: {
        preloading: true,
        spriteURL: '/ath/ath_unit07.png',
        atlasURL: '/ath/ath_unit07.json',
        dataURL: '/ath/drone.json'
    },
    gathering: {
        preloading: true,
        spriteURL: '/ath/ath_unit08.png',
        atlasURL: '/ath/ath_unit08.json',
        dataURL: '/ath/gathering.json'
    },
    clairvoyant: {
        preloading: true,
        spriteURL: '/ath/ath_unit09.png',
        atlasURL: '/ath/ath_unit09.json',
        dataURL: '/ath/clairvoyant.json'
    },
    lancet: {
        preloading: true,
        spriteURL: '/ath/ath_unit10.png',
        atlasURL: '/ath/ath_unit10.json',
        dataURL: '/ath/lancet.json'
    },
    theocrat: {
        preloading: true,
        spriteURL: '/ath/ath_unit11.png',
        atlasURL: '/ath/ath_unit11.json',
        dataURL: '/ath/theocrat.json'
    },
    lifevessel: {
        preloading: true,
        spriteURL: '/ath/ath_unit12.png',
        atlasURL: '/ath/ath_unit12.json',
        dataURL: '/ath/lifevessel.json'
    },
    rector: {
        preloading: true,
        spriteURL: '/ath/ath_unit13.png',
        atlasURL: '/ath/ath_unit13.json',
        dataURL: '/ath/rector.json'
    },
    centralpyramid: {
        preloading: true,
        spriteURL: '/ath/ath_build01.png',
        atlasURL: '/ath/ath_build01.json',
        dataURL: '/ath/centralpyramid.json'
    },        
    masstransmitter: {
        preloading: true,
        spriteURL: '/ath/ath_build02.png',
        atlasURL: '/ath/ath_build02.json',
        dataURL: '/ath/masstransmitter.json'
    },        
    biosphere: {
        preloading: true,
        spriteURL: '/ath/ath_build03.png',
        atlasURL: '/ath/ath_build03.json',
        dataURL: '/ath/biosphere.json'
    },        
    powercore: {
        preloading: true,
        spriteURL: '/ath/ath_build04.png',
        atlasURL: '/ath/ath_build04.json',
        dataURL: '/ath/powercore.json'
    },        
    polaronsphere: {
        preloading: true,
        spriteURL: '/ath/ath_build05.png',
        atlasURL: '/ath/ath_build05.json',
        dataURL: '/ath/polaronsphere.json'
    },        
    obelisk: {
        preloading: true,
        spriteURL: '/ath/ath_build06.png',
        atlasURL: '/ath/ath_build06.json',
        dataURL: '/ath/obelisk.json'
    },        
    sanctuary: {
        preloading: true,
        spriteURL: '/ath/ath_build07.png',
        atlasURL: '/ath/ath_build07.json',
        dataURL: '/ath/sanctuary.json'
    },        
    synodum: {
        preloading: true,
        spriteURL: '/ath/ath_build08.png',
        atlasURL: '/ath/ath_build08.json',
        dataURL: '/ath/synodum.json'
    },        
    conservatory: {
        preloading: true,
        spriteURL: '/ath/ath_build09.png',
        atlasURL: '/ath/ath_build09.json',
        dataURL: '/ath/conservatory.json'
    },        
    monumentofwill: {
        preloading: true,
        spriteURL: '/ath/ath_build10.png',
        atlasURL: '/ath/ath_build10.json',
        dataURL: '/ath/monumentofwill.json'
    },        
    basilica: {
        preloading: true,
        spriteURL: '/ath/ath_build11.png',
        atlasURL: '/ath/ath_build11.json',
        dataURL: '/ath/basilica.json'
    },        
    theocratsseat: {
        preloading: true,
        spriteURL: '/ath/ath_build12.png',
        atlasURL: '/ath/ath_build12.json',
        dataURL: '/ath/theocratsseat.json'
    },        
    shieldgenerator: {
        preloading: true,
        spriteURL: '/ath/ath_build13.png',
        atlasURL: '/ath/ath_build13.json',
        dataURL: '/ath/shieldgenerator.json'
    },

    // ----------------------------------------------------------------------------
    // SYL
    // ----------------------------------------------------------------------------
    spear: {
        preloading: true,
        spriteURL: '/syl/syl_unit01.png',
        atlasURL: '/syl/syl_unit01.json',
        dataURL: '/syl/spear.json'
    },

    twinblade: {
        preloading: true,
        spriteURL: '/syl/syl_unit02.png',
        atlasURL: '/syl/syl_unit02.json',
        dataURL: '/syl/twinblade.json'
    },

    gloom: {
        preloading: true,
        spriteURL: '/syl/syl_unit03.png',
        atlasURL: '/syl/syl_unit03.json',
        dataURL: '/syl/gloom.json'
    },

    eclipse: {
        preloading: true,
        spriteURL: '/syl/syl_unit04.png',
        atlasURL: '/syl/syl_unit04.json',
        dataURL: '/syl/eclipse.json'
    },

    shade: {
        preloading: true,
        spriteURL: '/syl/syl_unit05.png',
        atlasURL: '/syl/syl_unit05.json',
        dataURL: '/syl/shade.json'
    },

    plasmaraid: {
        preloading: true,
        spriteURL: '/syl/syl_unit06.png',
        atlasURL: '/syl/syl_unit06.json',
        dataURL: '/syl/plasmaraid.json'
    },

    hauler: {
        preloading: true,
        spriteURL: '/syl/syl_unit07.png',
        atlasURL: '/syl/syl_unit07.json',
        dataURL: '/syl/hauler.json'
    },

    labor: {
        preloading: true,
        spriteURL: '/syl/syl_unit08.png',
        atlasURL: '/syl/syl_unit08.json',
        dataURL: '/syl/labor.json'
    },

    installator: {
        preloading: true,
        spriteURL: '/syl/syl_unit09.png',
        atlasURL: '/syl/syl_unit09.json',
        dataURL: '/syl/installator.json'
    },

    absorber: {
        preloading: true,
        spriteURL: '/syl/syl_unit10.png',
        atlasURL: '/syl/syl_unit10.json',
        dataURL: '/syl/absorber.json'
    },

    assimilator: {
        preloading: true,
        spriteURL: '/syl/syl_unit11.png',
        atlasURL: '/syl/syl_unit11.json',
        dataURL: '/syl/assimilator.json'
    },

    mask: {
        preloading: true,
        spriteURL: '/syl/syl_unit12.png',
        atlasURL: '/syl/syl_unit12.json',
        dataURL: '/syl/mask.json'
    },

    caldron: {
        preloading: true,
        spriteURL: '/syl/syl_unit13.png',
        atlasURL: '/syl/syl_unit13.json',
        dataURL: '/syl/caldron.json'
    },

    leechmine: {
        preloading: true,
        spriteURL: '/syl/syl_unit14.png',
        atlasURL: '/syl/syl_unit14.json',
        dataURL: '/syl/leechmine.json'
    },

    installationprime: {
        preloading: true,
        spriteURL: '/syl/syl_build01.png',
        atlasURL: '/syl/syl_build01.json',
        dataURL: '/syl/installationprime.json'
    },

    refinery: {
        preloading: true,
        spriteURL: '/syl/syl_build02.png',
        atlasURL: '/syl/syl_build02.json',
        dataURL: '/syl/refinery.json'
    },

    supportcenter: {
        preloading: true,
        spriteURL: '/syl/syl_build03.png',
        atlasURL: '/syl/syl_build03.json',
        dataURL: '/syl/supportcenter.json'
    },

    manufacture: {
        preloading: true,
        spriteURL: '/syl/syl_build04.png',
        atlasURL: '/syl/syl_build04.json',
        dataURL: '/syl/manufacture.json'
    },

    advancedmanufacture: {
        preloading: true,
        spriteURL: '/syl/syl_build05.png',
        atlasURL: '/syl/syl_build05.json',
        dataURL: '/syl/advancedmanufacture.json'
    },

    manufactureprime: {
        preloading: true,
        spriteURL: '/syl/syl_build06.png',
        atlasURL: '/syl/syl_build06.json',
        dataURL: '/syl/manufactureprime.json'
    },

    defensiveserver: {
        preloading: true,
        spriteURL: '/syl/syl_build07.png',
        atlasURL: '/syl/syl_build07.json',
        dataURL: '/syl/defensiveserver.json'
    },

    offensiveserver: {
        preloading: true,
        spriteURL: '/syl/syl_build08.png',
        atlasURL: '/syl/syl_build08.json',
        dataURL: '/syl/offensiveserver.json'
    },

    quantumcore: {
        preloading: true,
        spriteURL: '/syl/syl_build09.png',
        atlasURL: '/syl/syl_build09.json',
        dataURL: '/syl/quantumcore.json'
    },

    aegis: {
        preloading: true,
        spriteURL: '/syl/syl_build10.png',
        atlasURL: '/syl/syl_build10.json',
        dataURL: '/syl/aegis.json'
    },

    wormholegenerator: {
        preloading: true,
        spriteURL: '/syl/syl_build11.png',
        atlasURL: '/syl/syl_build11.json',
        dataURL: '/syl/wormholegenerator.json'
    },

    repairstation: {
        preloading: true,
        spriteURL: '/syl/syl_build12.png',
        atlasURL: '/syl/syl_build12.json',
        dataURL: '/syl/repairstation.json'
    },

    supportcomplex: {
        preloading: true,
        spriteURL: '/syl/syl_build13.png',
        atlasURL: '/syl/syl_build13.json',
        dataURL: '/syl/supportcomplex.json'
    },

    // ----------------------------------------------------------------------------
    // THO
    // ----------------------------------------------------------------------------
    predator: {
        preloading: true,
        spriteURL: '/tho/tho_unit01.png',
        atlasURL: '/tho/tho_unit01.json',
        dataURL: '/tho/predator.json'
    },

    maraduer: {
        preloading: true,
        spriteURL: '/tho/tho_unit02.png',
        atlasURL: '/tho/tho_unit02.json',
        dataURL: '/tho/maraduer.json'
    },

    devastator: {
        preloading: true,
        spriteURL: '/tho/tho_unit03.png',
        atlasURL: '/tho/tho_unit03.json',
        dataURL: '/tho/devastator.json'
    },

    grinder: {
        preloading: true,
        spriteURL: '/tho/tho_unit04.png',
        atlasURL: '/tho/tho_unit04.json',
        dataURL: '/tho/grinder.json'
    },

    vindicator: {
        preloading: true,
        spriteURL: '/tho/tho_unit05.png',
        atlasURL: '/tho/tho_unit05.json',
        dataURL: '/tho/vindicator.json'
    },

    flagship: {
        preloading: true,
        spriteURL: '/tho/tho_unit06.png',
        atlasURL: '/tho/tho_unit06.json',
        dataURL: '/tho/flagship.json'
    },

    harvester: {
        preloading: true,
        spriteURL: '/tho/tho_unit07.png',
        atlasURL: '/tho/tho_unit07.json',
        dataURL: '/tho/harvester.json'
    },

    welder: {
        preloading: true,
        spriteURL: '/tho/tho_unit08.png',
        atlasURL: '/tho/tho_unit08.json',
        dataURL: '/tho/welder.json'
    },

    hunter: {
        preloading: true,
        spriteURL: '/tho/tho_unit09.png',
        atlasURL: '/tho/tho_unit09.json',
        dataURL: '/tho/hunter.json'
    },

    corsair: {
        preloading: true,
        spriteURL: '/tho/tho_unit10.png',
        atlasURL: '/tho/tho_unit10.json',
        dataURL: '/tho/corsair.json'
    },

    havoc: {
        preloading: true,
        spriteURL: '/tho/tho_unit11.png',
        atlasURL: '/tho/tho_unit11.json',
        dataURL: '/tho/havoc.json'
    },

    breaker: {
        preloading: true,
        spriteURL: '/tho/tho_unit12.png',
        atlasURL: '/tho/tho_unit12.json',
        dataURL: '/tho/breaker.json'
    },

    vanguard: {
        preloading: true,
        spriteURL: '/tho/tho_unit13.png',
        atlasURL: '/tho/tho_unit13.json',
        dataURL: '/tho/vanguard.json'
    },

    capitol: {
        preloading: true,
        spriteURL: '/tho/tho_build01.png',
        atlasURL: '/tho/tho_build01.json',
        dataURL: '/tho/capitol.json'
    },

    materialsilo: {
        preloading: true,
        spriteURL: '/tho/tho_build02.png',
        atlasURL: '/tho/tho_build02.json',
        dataURL: '/tho/materialsilo.json'
    },

    habitat: {
        preloading: true,
        spriteURL: '/tho/tho_build03.png',
        atlasURL: '/tho/tho_build03.json',
        dataURL: '/tho/habitat.json'
    },

    powerplant: {
        preloading: true,
        spriteURL: '/tho/tho_build04.png',
        atlasURL: '/tho/tho_build04.json',
        dataURL: '/tho/powerplant.json'
    },

    energystorage: {
        preloading: true,
        spriteURL: '/tho/tho_build05.png',
        atlasURL: '/tho/tho_build05.json',
        dataURL: '/tho/energystorage.json'
    },

    hall: {
        preloading: true,
        spriteURL: '/tho/tho_build06.png',
        atlasURL: '/tho/tho_build06.json',
        dataURL: '/tho/hall.json'
    },

    flagshipyard: {
        preloading: true,
        spriteURL: '/tho/tho_build07.png',
        atlasURL: '/tho/tho_build07.json',
        dataURL: '/tho/flagshipyard.json'
    },

    forum: {
        preloading: true,
        spriteURL: '/tho/tho_build08.png',
        atlasURL: '/tho/tho_build08.json',
        dataURL: '/tho/forum.json'
    },

    skycourt: {
        preloading: true,
        spriteURL: '/tho/tho_build09.png',
        atlasURL: '/tho/tho_build09.json',
        dataURL: '/tho/skycourt.json'
    },

    senate: {
        preloading: true,
        spriteURL: '/tho/tho_build10.png',
        atlasURL: '/tho/tho_build10.json',
        dataURL: '/tho/senate.json'
    },

    guardstation: {
        preloading: true,
        spriteURL: '/tho/tho_build11.png',
        atlasURL: '/tho/tho_build11.json',
        dataURL: '/tho/guardstation.json'
    },

    provincialbeacon: {
        preloading: true,
        spriteURL: '/tho/tho_build12.png',
        atlasURL: '/tho/tho_build12.json',
        dataURL: '/tho/provincialbeacon.json'
    },

    ioncannon: {
        preloading: true,
        spriteURL: '/tho/tho_build13.png',
        atlasURL: '/tho/tho_build13.json',
        dataURL: '/tho/ioncannon.json'
    },

    // ----------------------------------------------------------------------------
    // ZHO
    // ----------------------------------------------------------------------------
    spawn: {
        preloading: true,
        spriteURL: '/zho/zho_unit01.png',
        atlasURL: '/zho/zho_unit01.json',
        dataURL: '/zho/spawn.json'
    },

    guard: {
        preloading: true,
        spriteURL: '/zho/zho_unit02.png',
        atlasURL: '/zho/zho_unit02.json',
        dataURL: '/zho/guard.json'
    },

    venator: {
        preloading: true,
        spriteURL: '/zho/zho_unit03.png',
        atlasURL: '/zho/zho_unit03.json',
        dataURL: '/zho/venator.json'
    },

    mind: {
        preloading: true,
        spriteURL: '/zho/zho_unit04.png',
        atlasURL: '/zho/zho_unit04.json',
        dataURL: '/zho/mind.json'
    },

    overseer: {
        preloading: true,
        spriteURL: '/zho/zho_unit05.png',
        atlasURL: '/zho/zho_unit05.json',
        dataURL: '/zho/overseer.json'
    },

    swarmmother: {
        preloading: true,
        spriteURL: '/zho/zho_unit06.png',
        atlasURL: '/zho/zho_unit06.json',
        dataURL: '/zho/swarmmother.json'
    },

    spikeworm: {
        preloading: true,
        spriteURL: '/zho/zho_unit07.png',
        atlasURL: '/zho/zho_unit07.json',
        dataURL: '/zho/spikeworm.json'
    },

    queen: {
        preloading: true,
        spriteURL: '/zho/zho_unit08.png',
        atlasURL: '/zho/zho_unit08.json',
        dataURL: '/zho/queen.json'
    },

    ovum: {
        preloading: true,
        spriteURL: '/zho/zho_unit09.png',
        atlasURL: '/zho/zho_unit09.json',
        dataURL: '/zho/ovum.json'
    },

    mindovum: {
        preloading: true,
        spriteURL: '/zho/zho_unit10.png',
        atlasURL: '/zho/zho_unit10.json',
        dataURL: '/zho/mindovum.json'
    },

    reincarnate: {
        preloading: true,
        spriteURL: '/zho/zho_unit11.png',
        atlasURL: '/zho/zho_unit11.json',
        dataURL: '/zho/reincarnate.json'
    },

    worker: {
        preloading: true,
        spriteURL: '/zho/zho_unit12.png',
        atlasURL: '/zho/zho_unit12.json',
        dataURL: '/zho/worker.json'
    },

    rictus: {
        preloading: true,
        spriteURL: '/zho/zho_unit13.png',
        atlasURL: '/zho/zho_unit13.json',
        dataURL: '/zho/rictus.json'
    },

    mite: {
        preloading: true,
        spriteURL: '/zho/zho_unit14.png',
        atlasURL: '/zho/zho_unit14.json',
        dataURL: '/zho/mite.json'
    },

    ruptor: {
        preloading: true,
        spriteURL: '/zho/zho_unit15.png',
        atlasURL: '/zho/zho_unit15.json',
        dataURL: '/zho/ruptor.json'
    },

    decay: {
        preloading: true,
        spriteURL: '/zho/zho_unit16.png',
        atlasURL: '/zho/zho_unit16.json',
        dataURL: '/zho/decay.json'
    },

    cropbed: {
        preloading: true,
        spriteURL: '/zho/zho_build01.png',
        atlasURL: '/zho/zho_build01.json',
        dataURL: '/zho/cropbed.json'
    },

    nutrientcolony: {
        preloading: true,
        spriteURL: '/zho/zho_build02.png',
        atlasURL: '/zho/zho_build02.json',
        dataURL: '/zho/nutrientcolony.json'
    },

    metabolist: {
        preloading: true,
        spriteURL: '/zho/zho_build03.png',
        atlasURL: '/zho/zho_build03.json',
        dataURL: '/zho/metabolist.json'
    },

    agaric: {
        preloading: true,
        spriteURL: '/zho/zho_build04.png',
        atlasURL: '/zho/zho_build04.json',
        dataURL: '/zho/agaric.json'
    },

    mindfungus: {
        preloading: true,
        spriteURL: '/zho/zho_build05.png',
        atlasURL: '/zho/zho_build05.json',
        dataURL: '/zho/mindfungus.json'
    },

    clathruscolony: {
        preloading: true,
        spriteURL: '/zho/zho_build06.png',
        atlasURL: '/zho/zho_build06.json',
        dataURL: '/zho/clathruscolony.json'
    },

    symbioticorgan: {
        preloading: true,
        spriteURL: '/zho/zho_build07.png',
        atlasURL: '/zho/zho_build07.json',
        dataURL: '/zho/symbioticorgan.json'
    },

    evulatory: {
        preloading: true,
        spriteURL: '/zho/zho_build08.png',
        atlasURL: '/zho/zho_build08.json',
        dataURL: '/zho/evulatory.json'
    },

    swarmmembrane: {
        preloading: true,
        spriteURL: '/zho/zho_build09.png',
        atlasURL: '/zho/zho_build09.json',
        dataURL: '/zho/swarmmembrane.json'
    },

    chrysodendron: {
        preloading: true,
        spriteURL: '/zho/zho_build10.png',
        atlasURL: '/zho/zho_build10.json',
        dataURL: '/zho/chrysodendron.json'
    },

    chimneyplant: {
        preloading: true,
        spriteURL: '/zho/zho_build11.png',
        atlasURL: '/zho/zho_build11.json',
        dataURL: '/zho/chimneyplant.json'
    },

    decaychamber: {
        preloading: true,
        spriteURL: '/zho/zho_build12.png',
        atlasURL: '/zho/zho_build12.json',
        dataURL: '/zho/decaychamber.json'
    },

    fonia: {
        preloading: true,
        spriteURL: '/zho/zho_build13.png',
        atlasURL: '/zho/zho_build13.json',
        dataURL: '/zho/fonia.json'
    },

    seed: {
        preloading: true,
        spriteURL: '/zho/zho_build14.png',
        atlasURL: '/zho/zho_build14.json',
        dataURL: '/zho/seed.json'
    },

    // ----------------------------------------------------------------------------
    // ASTEROIDS
    // ----------------------------------------------------------------------------
    asteroid1: {
        preloading: true,
        spriteURL: '/ast/asteroid01.png',
        atlasURL: '/ast/asteroid01.json',
        dataURL: '/ast/asteroid1.json'            
    },
    asteroid2: {
        preloading: true,
        spriteURL: '/ast/asteroid02.png',
        atlasURL: '/ast/asteroid02.json',
        dataURL: '/ast/asteroid2.json'            
    },
    asteroid3: {
        preloading: true,
        spriteURL: '/ast/asteroid03.png',
        atlasURL: '/ast/asteroid03.json',
        dataURL: '/ast/asteroid3.json'            
    },
    asteroid4: {
        preloading: true,
        spriteURL: '/ast/asteroid04.png',
        atlasURL: '/ast/asteroid04.json',
        dataURL: '/ast/asteroid4.json'            
    },
    asteroidbig1: {
        preloading: true,
        spriteURL: '/ast/asteroid_big01.png',
        atlasURL: '/ast/asteroid_big01.json',
        dataURL: '/ast/asteroidbig1.json'            
    },
    asteroidbig2: {
        preloading: true,
        spriteURL: '/ast/asteroid_big02.png',
        atlasURL: '/ast/asteroid_big02.json',
        dataURL: '/ast/asteroidbig2.json'            
    },        
    asteroidsmall1: {
        preloading: true,
        spriteURL: '/ast/asteroid_sm01.png',
        atlasURL: '/ast/asteroid_sm01.json',
        dataURL: '/ast/asteroidsmall1.json'            
    },
    asteroidsmall2: {
        preloading: true,
        spriteURL: '/ast/asteroid_sm02.png',
        atlasURL: '/ast/asteroid_sm02.json',
        dataURL: '/ast/asteroidsmall2.json'            
    },
    asteroidsmall3: {
        preloading: true,
        spriteURL: '/ast/asteroid_sm03.png',
        atlasURL: '/ast/asteroid_sm03.json',
        dataURL: '/ast/asteroidsmall3.json'            
    },
    asteroidsmall4: {
        preloading: true,
        spriteURL: '/ast/asteroid_sm04.png',
        atlasURL: '/ast/asteroid_sm04.json',
        dataURL: '/ast/asteroidsmall4.json'            
    },
    asteroidice1: {
        preloading: true,
        spriteURL: '/ast/asteroid_ice01.png',
        atlasURL: '/ast/asteroid_ice01.json',
        dataURL: '/ast/asteroidice1.json'            
    },
    asteroidice2: {
        preloading: true,
        spriteURL: '/ast/asteroid_ice01.png',
        atlasURL: '/ast/asteroid_ice01.json',
        dataURL: '/ast/asteroidice2.json'            
    },
    asteroidicesmall1: {
        preloading: true,
        spriteURL: '/ast/asteroid_ice_sm01.png',
        atlasURL: '/ast/asteroid_ice_sm01.json',
        dataURL: '/ast/asteroidice1.json'            
    },
    asteroidicesmall2: {
        preloading: true,
        spriteURL: '/ast/asteroid_ice_sm02.png',
        atlasURL: '/ast/asteroid_ice_sm02.json',
        dataURL: '/ast/asteroidice2.json'            
    },
    asteroidsilicon1: {
        preloading: true,
        spriteURL: '/ast/asteroid_silicon01.png',
        atlasURL: '/ast/asteroid_silicon01.json',
        dataURL: '/ast/asteroidsilicon1.json'            
    },
    asteroidsilicon2: {
        preloading: true,
        spriteURL: '/ast/asteroid_silicon02.png',
        atlasURL: '/ast/asteroid_silicon02.json',
        dataURL: '/ast/asteroidsilicon2.json'            
    },
    asteroidsiliconsmall1: {
        preloading: true,
        spriteURL: '/ast/asteroid_silicon_sm01.png',
        atlasURL: '/ast/asteroid_silicon_sm01.json',
        dataURL: '/ast/asteroidsiliconsmall1.json'            
    },
    asteroidsiliconsmall2: {
        preloading: true,
        spriteURL: '/ast/asteroid_silicon_sm02.png',
        atlasURL: '/ast/asteroid_silicon_sm02.json',
        dataURL: '/ast/asteroidsiliconsmall2.json'            
    },                
    asteroidtitanium1: {
        preloading: true,
        spriteURL: '/ast/asteroid_titanium01.png',
        atlasURL: '/ast/asteroid_titanium01.json',
        dataURL: '/ast/asteroidtitanium1.json'            
    },
    asteroidtitanium2: {
        preloading: true,
        spriteURL: '/ast/asteroid_titanium02.png',
        atlasURL: '/ast/asteroid_titanium02.json',
        dataURL: '/ast/asteroidtitanium2.json'            
    },
    asteroidtitaniumsmall1: {
        preloading: true,
        spriteURL: '/ast/asteroid_titanium_sm01.png',
        atlasURL: '/ast/asteroid_titanium_sm01.json',
        dataURL: '/ast/asteroidtitaniumsmall1.json'            
    },
    asteroidtitaniumsmall2: {
        preloading: true,
        spriteURL: '/ast/asteroid_titanium_sm02.png',
        atlasURL: '/ast/asteroid_titanium_sm02.json',
        dataURL: '/ast/asteroidtitaniumsmall2.json'            
    },
    asteroiduranium1: {
        preloading: true,
        spriteURL: '/ast/asteroid_uranium01.png',
        atlasURL: '/ast/asteroid_uranium01.json',
        dataURL: '/ast/asteroiduranium1.json'            
    },
    asteroiduranium2: {
        preloading: true,
        spriteURL: '/ast/asteroid_uranium02.png',
        atlasURL: '/ast/asteroid_uranium02.json',
        dataURL: '/ast/asteroiduranium2.json'            
    },
    asteroiduraniumsmall1: {
        preloading: true,
        spriteURL: '/ast/asteroid_uranium_sm01.png',
        atlasURL: '/ast/asteroid_uranium_sm01.json',
        dataURL: '/ast/asteroiduraniumsmall1.json'            
    },
    asteroiduraniumsmall2: {
        preloading: true,
        spriteURL: '/ast/asteroid_uranium_sm02.png',
        atlasURL: '/ast/asteroid_uranium_sm02.json',
        dataURL: '/ast/asteroiduraniumsmall2.json'            
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

            const spriteUrl = PATH_ASSETS_IMG + ns.effects[key].spriteURL;
            const atlasUrl = PATH_ASSETS_IMG + ns.effects[key].atlasURL;
            const dataUrl = PATH_ASSETS_DATA + ns.effects[key].dataURL;

            preloader.load.atlasJSONHash(key, spriteUrl, atlasUrl);
            preloader.load.json(key, dataUrl);
            
        }, preloader);

    }
}
