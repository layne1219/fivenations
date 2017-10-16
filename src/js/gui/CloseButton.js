import { GUI_CLOSE_BUTTON } from '../common/Const';
const ns = window.fivenations;

/**
 * Realises a basic CloseButton that inherits from Phaser.Group
 */
class CloseButton extends Phaser.Group {

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
        const onClick = () => config.onClick && config.onClick.bind(this);
        const { id } = GUI_CLOSE_BUTTON.spritesheet;
        const { over, out, down } = GUI_CLOSE_BUTTON.frames;

        this.sprite = phaserGame.add.button(0, 0, id, onClick, this, over, out, down);
        this.add(this.sprite);
    }
    
}

export { CloseButton };
export default CloseButton;