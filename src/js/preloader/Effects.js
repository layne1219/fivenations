const ns = window.fivenations;
const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS_DATA = `${PUBLIC_URL}/assets/datas/effects`;
const PATH_ASSETS_IMG = `${PUBLIC_URL}/assets/images/effects`;

// const like object to describe all the effects participating in the gameplay 
ns.effects = Object.assign(ns.effects || {}, {

    'blow-1': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow01.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow01.json',
        dataURL: PATH_ASSETS_DATA + '/blow-1.json'
    },

    'blow-2': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow02.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow02.json',
        dataURL: PATH_ASSETS_DATA + '/blow-2.json'
    },

    'blow-3': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow03.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow03.json',
        dataURL: PATH_ASSETS_DATA + '/blow-3.json'
    },                

    'blow-4': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow04.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow04.json',
        dataURL: PATH_ASSETS_DATA + '/blow-4.json'
    },

    'blow-5a': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow05_0.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow05_0.json',
        dataURL: PATH_ASSETS_DATA + '/blow-5a.json'
    },

    'blow-5b': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow05_1.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow05_1.json',
        dataURL: PATH_ASSETS_DATA + '/blow-5b.json'
    },

    'blow-6': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow06.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow06.json',
        dataURL: PATH_ASSETS_DATA + '/blow-6.json'
    }, 

    'blow-7': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow07.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow07.json',
        dataURL: PATH_ASSETS_DATA + '/blow-7.json'
    },

    'blow-8': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow08.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow08.json',
        dataURL: PATH_ASSETS_DATA + '/blow-8.json'
    },

    'blow-9': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow09.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow09.json',
        dataURL: PATH_ASSETS_DATA + '/blow-9.json'
    },

    'blow-10': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow10.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow10.json',
        dataURL: PATH_ASSETS_DATA + '/blow-10.json'
    },

    'blow-11': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow11.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow11.json',
        dataURL: PATH_ASSETS_DATA + '/blow-11.json'
    },

    'blow-12': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow12.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow12.json',
        dataURL: PATH_ASSETS_DATA + '/blow-12.json'
    },

    'blow-13': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow13.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow13.json',
        dataURL: PATH_ASSETS_DATA + '/blow-13.json'
    },

    'blackhole': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blackhole.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blackhole.json',
        dataURL: PATH_ASSETS_DATA + '/blackhole.json'
    },

    'destruction-big': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_destruction_big.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_destruction_big.json',
        dataURL: PATH_ASSETS_DATA + '/destruction-big.json'
    },

    'destruction-medium': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_destruction_medium.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_destruction_medium.json',
        dataURL: PATH_ASSETS_DATA + '/destruction-medium.json'
    },

    'destruction-small': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_destruction_sm.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_destruction_sm.json',
        dataURL: PATH_ASSETS_DATA + '/destruction-small.json'
    },

    'destruction-bio-big': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_destruction_bio_big.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_destruction_bio_big.json',
        dataURL: PATH_ASSETS_DATA + '/destruction-bio-big.json'
    },

    'destruction-bio-medium': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_destruction_bio_medium.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_destruction_bio_medium.json',
        dataURL: PATH_ASSETS_DATA + '/destruction-bio-medium.json'
    },

    'destruction-bio-small': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_destruction_bio_sm.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_destruction_bio_sm.json',
        dataURL: PATH_ASSETS_DATA + '/destruction-bio-small.json'
    },

    'destructivefield': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_destructivefield.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_destructivefield.json',
        dataURL: PATH_ASSETS_DATA + '/destructivefield.json'
    },

    'nebulacloud': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_nebulacloud.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_nebulacloud.json',
        dataURL: PATH_ASSETS_DATA + '/nebulacloud.json'
    },      

    'sporecloud': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_sporecloud.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_sporecloud.json',
        dataURL: PATH_ASSETS_DATA + '/sporecloud.json'
    },

    'smoke-trail-1': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/smoke_trail01.png',
        atlasURL: PATH_ASSETS_IMG + '/smoke_trail01.json',
        dataURL: PATH_ASSETS_DATA + '/smoke-trail-1.json'
    },

    'smoke-trail-2': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/smoke_trail02.png',
        atlasURL: PATH_ASSETS_IMG + '/smoke_trail02.json',
        dataURL: PATH_ASSETS_DATA + '/smoke-trail-2.json'
    },

    'smoke-trail-3': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/smoke_trail03.png',
        atlasURL: PATH_ASSETS_IMG + '/smoke_trail03.json',
        dataURL: PATH_ASSETS_DATA + '/smoke-trail-3.json'
    },

    'smoke-trail-4': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/smoke_trail04.png',
        atlasURL: PATH_ASSETS_IMG + '/smoke_trail04.json',
        dataURL: PATH_ASSETS_DATA + '/smoke-trail-4.json'
    },

    'flash': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/effect_blow05_1.png',
        atlasURL: PATH_ASSETS_IMG + '/effect_blow05_1.json',
        dataURL: PATH_ASSETS_DATA + '/flash.json'
    },   
    
});

export default {

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
