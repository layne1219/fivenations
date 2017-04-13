export default {
    /**
    * Loading assets for the in-game GUI
    * @param {object} [preloader] Preloader object defined below
    * @return {void}
    */
    load: preloader => {
        preloader.load.atlasJSONHash('gui', 'assets/images/gui/GUI_element.png', 'assets/images/gui/GUI_element.json');
        preloader.load.atlasJSONHash('energy-shield-big', 'assets/images/effects/effect_shield_big.png', 'assets/images/effects/effect_shield_big.json');
        preloader.load.atlasJSONHash('energy-shield-medium', 'assets/images/effects/effect_shield_medium.png', 'assets/images/effects/effect_shield_medium.json');
        preloader.load.atlasJSONHash('energy-shield-small', 'assets/images/effects/effect_shield_sm.png', 'assets/images/effects/effect_shield_sm.json');
        preloader.load.atlasJSONHash('gui.icons.fed', 'assets/images/gui/fed_icons.png', 'assets/images/gui/fed_icons.json');
        preloader.load.atlasJSONHash('gui.icons.ath', 'assets/images/gui/ath_icons.png', 'assets/images/gui/ath_icons.json');
        preloader.load.atlasJSONHash('gui.icons.syl', 'assets/images/gui/syl_icons.png', 'assets/images/gui/syl_icons.json');
        preloader.load.atlasJSONHash('gui.icons.obj', 'assets/images/gui/obj_icons.png', 'assets/images/gui/obj_icons.json');
    }    
}