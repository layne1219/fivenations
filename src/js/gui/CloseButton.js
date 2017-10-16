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

        this.sprite = phaserGame.add.button(0, 0, GUI_CLOSE_BUTTON.spritesheet.id, onClick, this, GUI_BUTTON.frames.over, GUI_BUTTON.frames.out, GUI_BUTTON.frames.down);
        this.add(this.sprite);
    }
    
}

export { CloseButton };
export default CloseButton;