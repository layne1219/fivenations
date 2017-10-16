import { GUI_POPUP } from '../common/Const';
const ns = window.fivenations;

/**
 * Realises a basic Popup that inherits from Phaser.Group
 */
class Popup extends Phaser.Group {

    /**
     * @param {object} config - Configuration object
     */
    constructor(config){
        super(ns.game.game);
        this.initBasicComponents(config);
        this.initButtons(config);
    }

    /**
     * Instantiate the components 
     * @param {object} config - configuration object to specify the button
     */
    initBasicComponents(config) {
        const phaserGame = ns.game.game;
        const { id } = GUI_POPUP.spritesheet;
        const { text } = config;

        this.background = phaserGame.add.sprite(0, 0, id);

        this.text = phaserGame.add.text(0, 0, text, {
            ...GUI_POPUP.style,
            wordWrapWidth: this.sprite.width,
        });
        this.text.anchor.set(0.5);

        this.add(this.background);
        this.add(this.text);
    }

    /**
     * Generates the Confirm and Close buttons according to the given 
     * configuration object
     * @param {object} config - Configuration object 
     */
    initButtons(config) {

    }

    /**
     * Updates the button instance according to the passed configuration object
     * @param {object config - specify the updates 
     */
    update(config) {
        if (!config) return;
        if (config.text) this.text = config.text;
    }
    
}

export { Popup };
export default Popup;