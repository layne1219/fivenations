const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS = `${PUBLIC_URL}/assets/images`;

export default {
    /**
    * Loading assets for the in-game GUI
    * @param {object} [preloader] Preloader object defined below
    * @return {void}
    */
    load: preloader => {
        preloader.load.atlasJSONHash('gui', `${PATH_ASSETS}/gui/GUI_element.png`, `${PATH_ASSETS}/gui/GUI_element.json`);
        preloader.load.atlasJSONHash('energy-shield-big', `${PATH_ASSETS}/effects/effect_shield_big.png`, `${PATH_ASSETS}/effects/effect_shield_big.json`);
        preloader.load.atlasJSONHash('energy-shield-medium', `${PATH_ASSETS}/effects/effect_shield_medium.png`, `${PATH_ASSETS}/effects/effect_shield_medium.json`);
        preloader.load.atlasJSONHash('energy-shield-small', `${PATH_ASSETS}/effects/effect_shield_sm.png`, `${PATH_ASSETS}/effects/effect_shield_sm.json`);
        preloader.load.atlasJSONHash('gui.icons.fed', `${PATH_ASSETS}/gui/fed_icons.png`, `${PATH_ASSETS}/gui/fed_icons.json`);
        preloader.load.atlasJSONHash('gui.icons.ath', `${PATH_ASSETS}/gui/ath_icons.png`, `${PATH_ASSETS}/gui/ath_icons.json`);
        preloader.load.atlasJSONHash('gui.icons.syl', `${PATH_ASSETS}/gui/syl_icons.png`, `${PATH_ASSETS}/gui/syl_icons.json`);
        preloader.load.atlasJSONHash('gui.icons.tho', `${PATH_ASSETS}/gui/tho_icons.png`, `${PATH_ASSETS}/gui/tho_icons.json`);
        preloader.load.atlasJSONHash('gui.icons.zho', `${PATH_ASSETS}/gui/zho_icons.png`, `${PATH_ASSETS}/gui/zho_icons.json`);
        preloader.load.atlasJSONHash('gui.icons.obj', `${PATH_ASSETS}/gui/obj_icons.png`, `${PATH_ASSETS}/gui/obj_icons.json`);
        preloader.load.atlasJSONHash('color-indicator', `${PATH_ASSETS}/gui/player_color_indicator.png`, `${PATH_ASSETS}/gui/player_color_indicator.json`);
    }    
}