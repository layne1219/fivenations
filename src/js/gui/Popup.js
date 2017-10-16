import { GUI_POPUP } from '../common/Const';
import Button from './Button';
import CloseButton from './CloseButton';
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
        this.initConfirmButton(config);
        this.initCloseButton(config);
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
     * Generates the Confirm button according to the given 
     * configuration object
     * @param {object} config - Configuration object 
     */
    initConfirmButton(config) {
        const { text, onClick } = config;
        this.button = new Button({
            text,
            onClick
        });
        this.button.x = 0;
        this.button.y = 0;

        this.add(this.button);
    }

    /**
     * Generates the Confirm button according to the given 
     * configuration object
     * @param {object} config - Configuration object 
     */
    initCloseButton(config) {
        const { onClick } = config;
        this.button = new CloseButton({
            onClick
        });
        this.button.x = 0;
        this.button.y = 0;
        
        this.add(this.button);
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