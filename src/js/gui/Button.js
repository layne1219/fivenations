import { 
    GUI_BUTTON_STYLE,
    GUI_BUTTON_SPRITESHEET 
} as '../common/Const';
const ns = window.fivenations;

class Button extends Phaser.Group {

    constructor(config){
        super(ns.game.game);
        this.initComponents(config);
        this.update(config);
    }

    initComponents(config) {
        const phaserGame = ns.game.game;
        const onClick = () => config.onClick && config.onClick.bind(this);

        this.sprite = phaserGame.add.button(0, 0, GUI_BUTTON_SPRITESHEET, onClick);
        this.text = phaserGame.add.text(0, 0, "", {
            ...GUI_BUTTON_STYLE,
            wordWrapWidth: this.sprite.width,
        });
        this.text.anchor.set(0.5);

    }

    update(config) {
        if (config.text) this.textGroup.text = config.text;
    }
    
}


export { Button };
export default Button;