const ns = window.fivenations;
const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS_DATA = `${PUBLIC_URL}/assets/datas/effects`;
const PATH_ASSETS_IMG = `${PUBLIC_URL}/assets/images/effects`;

// const like object to describe all the effects participating in the gameplay 
ns.effects = Object.assign(ns.effects || {}, {

    'blow-1': {
        preloading: true,
        spriteURL: '/effect_blow01.png',
        atlasURL: '/effect_blow01.json',
        dataURL: '/blow-1.json'
    },

    'blow-2': {
        preloading: true,
        spriteURL: '/effect_blow02.png',
        atlasURL: '/effect_blow02.json',
        dataURL: '/blow-2.json'
    },

    'blow-3': {
        preloading: true,
        spriteURL: '/effect_blow03.png',
        atlasURL: '/effect_blow03.json',
        dataURL: '/blow-3.json'
    },                

    'blow-4': {
        preloading: true,
        spriteURL: '/effect_blow04.png',
        atlasURL: '/effect_blow04.json',
        dataURL: '/blow-4.json'
    },

    'blow-5a': {
        preloading: true,
        spriteURL: '/effect_blow05_0.png',
        atlasURL: '/effect_blow05_0.json',
        dataURL: '/blow-5a.json'
    },

    'blow-5b': {
        preloading: true,
        spriteURL: '/effect_blow05_1.png',
        atlasURL: '/effect_blow05_1.json',
        dataURL: '/blow-5b.json'
    },

    'blow-6': {
        preloading: true,
        spriteURL: '/effect_blow06.png',
        atlasURL: '/effect_blow06.json',
        dataURL: '/blow-6.json'
    }, 

    'blow-7': {
        preloading: true,
        spriteURL: '/effect_blow07.png',
        atlasURL: '/effect_blow07.json',
        dataURL: '/blow-7.json'
    },

    'blow-8': {
        preloading: true,
        spriteURL: '/effect_blow08.png',
        atlasURL: '/effect_blow08.json',
        dataURL: '/blow-8.json'
    },

    'blow-9': {
        preloading: true,
        spriteURL: '/effect_blow09.png',
        atlasURL: '/effect_blow09.json',
        dataURL: '/blow-9.json'
    },

    'blow-10': {
        preloading: true,
        spriteURL: '/effect_blow10.png',
        atlasURL: '/effect_blow10.json',
        dataURL: '/blow-10.json'
    },

    'blow-11': {
        preloading: true,
        spriteURL: '/effect_blow11.png',
        atlasURL: '/effect_blow11.json',
        dataURL: '/blow-11.json'
    },

    'blow-12': {
        preloading: true,
        spriteURL: '/effect_blow12.png',
        atlasURL: '/effect_blow12.json',
        dataURL: '/blow-12.json'
    },

    'blow-13': {
        preloading: true,
        spriteURL: '/effect_blow13.png',
        atlasURL: '/effect_blow13.json',
        dataURL: '/blow-13.json'
    },

    'blackhole': {
        preloading: true,
        spriteURL: '/effect_blackhole.png',
        atlasURL: '/effect_blackhole.json',
        dataURL: '/blackhole.json'
    },

    'destruction-big': {
        preloading: true,
        spriteURL: '/effect_destruction_big.png',
        atlasURL: '/effect_destruction_big.json',
        dataURL: '/destruction-big.json'
    },

    'destruction-medium': {
        preloading: true,
        spriteURL: '/effect_destruction_medium.png',
        atlasURL: '/effect_destruction_medium.json',
        dataURL: '/destruction-medium.json'
    },

    'destruction-small': {
        preloading: true,
        spriteURL: '/effect_destruction_sm.png',
        atlasURL: '/effect_destruction_sm.json',
        dataURL: '/destruction-small.json'
    },

    'destruction-bio-big': {
        preloading: true,
        spriteURL: '/effect_destruction_bio_big.png',
        atlasURL: '/effect_destruction_bio_big.json',
        dataURL: '/destruction-bio-big.json'
    },

    'destruction-bio-medium': {
        preloading: true,
        spriteURL: '/effect_destruction_bio_medium.png',
        atlasURL: '/effect_destruction_bio_medium.json',
        dataURL: '/destruction-bio-medium.json'
    },

    'destruction-bio-small': {
        preloading: true,
        spriteURL: '/effect_destruction_bio_sm.png',
        atlasURL: '/effect_destruction_bio_sm.json',
        dataURL: '/destruction-bio-small.json'
    },

    'destructivefield': {
        preloading: true,
        spriteURL: '/effect_destructivefield.png',
        atlasURL: '/effect_destructivefield.json',
        dataURL: '/destructivefield.json'
    },

    'nebulacloud': {
        preloading: true,
        spriteURL: '/effect_nebulacloud.png',
        atlasURL: '/effect_nebulacloud.json',
        dataURL: '/nebulacloud.json'
    },      

    'sporecloud': {
        preloading: true,
        spriteURL: '/effect_sporecloud.png',
        atlasURL: '/effect_sporecloud.json',
        dataURL: '/sporecloud.json'
    },

    'smoke-trail-1': {
        preloading: true,
        spriteURL: '/smoke_trail01.png',
        atlasURL: '/smoke_trail01.json',
        dataURL: '/smoke-trail-1.json'
    },

    'smoke-trail-2': {
        preloading: true,
        spriteURL: '/smoke_trail02.png',
        atlasURL: '/smoke_trail02.json',
        dataURL: '/smoke-trail-2.json'
    },

    'smoke-trail-3': {
        preloading: true,
        spriteURL: '/smoke_trail03.png',
        atlasURL: '/smoke_trail03.json',
        dataURL: '/smoke-trail-3.json'
    },

    'smoke-trail-4': {
        preloading: true,
        spriteURL: '/smoke_trail04.png',
        atlasURL: '/smoke_trail04.json',
        dataURL: '/smoke-trail-4.json'
    },

    'flash-blue-1': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-1.json'
    },   
    
    'flash-blue-2': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-2.json'
    },   
    
    'flash-blue-3': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-3.json'
    },   
    
    'flash-blue-4': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-4.json'
    },   
    
    'flash-blue-5': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-5.json'
    },   
    
    'flash-blue-6': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-6.json'
    },   
    
    'flash-blue-7': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-7.json'
    },   
    
    'flash-blue-8': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-blue-8.json'
    },

    'flash-green-1': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-1.json'
    },   
    
    'flash-green-2': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-2.json'
    },   
    
    'flash-green-3': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-3.json'
    },   
    
    'flash-green-4': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-4.json'
    },   
    
    'flash-green-5': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-5.json'
    },   
    
    'flash-green-6': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-6.json'
    },   
    
    'flash-green-7': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-7.json'
    },   
    
    'flash-green-8': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-green-8.json'
    },    
    
    'flash-orange-1': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-1.json'
    },   
    
    'flash-orange-2': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-2.json'
    },   
    
    'flash-orange-3': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-3.json'
    },   
    
    'flash-orange-4': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-4.json'
    },   
    
    'flash-orange-5': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-5.json'
    },   
    
    'flash-orange-6': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-6.json'
    },   
    
    'flash-orange-7': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-7.json'
    },   
    
    'flash-orange-8': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-orange-8.json'
    },

    'flash-white-1': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-1.json'
    },   
    
    'flash-white-2': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-2.json'
    },   
    
    'flash-white-3': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-3.json'
    },   
    
    'flash-white-4': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-4.json'
    },   
    
    'flash-white-5': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-5.json'
    },   
    
    'flash-white-6': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-6.json'
    },   
    
    'flash-white-7': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-7.json'
    },   
    
    'flash-white-8': {
        preloading: true,
        spriteURL: '/effect_flash.png',
        atlasURL: '/effect_flash.json',
        dataURL: '/flash-white-8.json'
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

            const spriteUrl = PATH_ASSETS_IMG + ns.effects[key].spriteURL;
            const atlasUrl = PATH_ASSETS_IMG + ns.effects[key].atlasURL;
            const dataUrl PATH_ASSETS_DATA + ns.effects[key].dataURL;

            preloader.load.atlasJSONHash(key, spriteUrl, atlasUrl);
            preloader.load.json(key, dataUrl);
            
        }, preloader);

    }
}
