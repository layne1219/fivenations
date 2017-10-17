import { GUI_BUTTON } from '../common/Const';
const ns = window.fivenations;

/**
 * Realises a basic Button that inherits from Phaser.Group
 */
class Button extends Phaser.Group {

    /**
     * @param {object} config - Configuration object
     */
    constructor(config){
        super(ns.game.game);
        this.initComponents(config);
        this.update(config);
    }

    /**
     * Instantiate the components 
     * @param {object} config - configuration object to specify the button
     */
    initComponents(config) {
        const phaserGame = ns.game.game;
        const onClick = () => config.onClick && config.onClick.call(this);

        this.sprite = phaserGame.add.button(0, 0, GUI_BUTTON.spritesheet.id, onClick, this, GUI_BUTTON.frames.over, GUI_BUTTON.frames.out, GUI_BUTTON.frames.down);
        this.sprite.anchor.set(0.5);

        this.text = phaserGame.add.text(0, 0, 'OK', {
            ...GUI_BUTTON.style,
            wordWrapWidth: this.sprite.width,
        });
        this.text.anchor.set(0.5);

        this.add(this.sprite);
        this.add(this.text);
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

export { Button };
export default Button;