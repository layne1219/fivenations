const ns = window.fivenations;
const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS_DATA = `${PUBLIC_URL}/assets/datas/projectiles`;
const PATH_ASSETS_IMG = `${PUBLIC_URL}/assets/images/projectiles`;


// const like object to describe all the effects participating in the gameplay 
ns.effects = Object.assign(ns.effects || {}, {

    'laser-beam-1': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/weapon_projectiles.png',
        atlasURL: PATH_ASSETS_IMG + '/weapon_projectiles.json',
        dataURL: PATH_ASSETS_DATA + '/laser-beam-1.json'
    },

    'cannonball': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/weapon_projectiles.png',
        atlasURL: PATH_ASSETS_IMG + '/weapon_projectiles.json',
        dataURL: PATH_ASSETS_DATA + '/cannonball.json'
    },

    'missile': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/weapon_projectiles.png',
        atlasURL: PATH_ASSETS_IMG + '/weapon_projectiles.json',
        dataURL: PATH_ASSETS_DATA + '/missile.json'
    },

    'rommel': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/weapon_projectiles.png',
        atlasURL: PATH_ASSETS_IMG + '/weapon_projectiles.json',
        dataURL: PATH_ASSETS_DATA + '/rommel.json'
    },

    'kinetic-torpedo': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/weapon_projectiles.png',
        atlasURL: PATH_ASSETS_IMG + '/weapon_projectiles.json',
        dataURL: PATH_ASSETS_DATA + '/kinetic-torpedo.json'
    },

    'asr-missile': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/weapon_projectiles.png',
        atlasURL: PATH_ASSETS_IMG + '/weapon_projectiles.json',
        dataURL: PATH_ASSETS_DATA + '/asr-missile.json'
    },

    'ragnarok-heavy-gun': {
        preloading: true,
        spriteURL: PATH_ASSETS_IMG + '/weapons.png',
        atlasURL: PATH_ASSETS_IMG + '/weapons.json',
        dataURL: PATH_ASSETS_DATA + '/ragnarok-heavy-gun.json'
    },

});

export default {

    /**
     * Loading all the correspondant resources for the effects listed in the private *effects* object
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    load: function(preloader) {

        const loaded = {};

        Object.keys(ns.effects).forEach(function(key) {

            if (!ns.effects[key].preloading) {
                return;
            }

            if (!loaded[ns.effects[key].spriteURL]) {
                preloader.load.atlasJSONHash(key, ns.effects[key].spriteURL, ns.effects[key].atlasURL);
            }

            if (!loaded[ns.effects[key].dataURL]) {
                preloader.load.json(key, ns.effects[key].dataURL);
            }

            loaded[ns.effects[key].spriteURL] = true;
            loaded[ns.effects[key].dataURL] = true;
            
        }, preloader);

    }
}
