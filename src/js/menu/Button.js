/* global window, Phaser */

// default styles for Button
const BUTTON = {
  spritesheet: {
    id: 'mainmenu-elements',
  },
  sizes: {
    xsm: {
      out: 'mainmenu_btn_extrasm_base.png',
      over: 'mainmenu_btn_extrasm_base.png',
      down: 'mainmenu_btn_extrasm_onclick.png',
    },
    sm: {
      out: 'mainmenu_btn_sm_base.png',
      over: 'mainmenu_btn_sm_base.png',
      down: 'mainmenu_btn_sm_onclick.png',
    },
    m: {
      out: 'mainmenu_btn_mid_base.png',
      over: 'mainmenu_btn_mid_base.png',
      down: 'mainmenu_btn_mid_onclick.png',
    },
    l: {
      out: 'mainmenu_btn_long_base.png',
      over: 'mainmenu_btn_long_base.png',
      down: 'mainmenu_btn_long_onclick.png',
    },
  },
  style: {
    font: '11px BerlinSansFB-Reg',
    fill: '#FFFFFF',
    boundsAlignH: 'center',
    wordWrap: true,
    align: 'center',
  },
};

const ns = window.fivenations;

/**
 * Realises a basic Button that inherits from Phaser.Group
 */
class Button extends Phaser.Group {
  /**
   * @param {object} config - Configuration object
   */
  constructor(config) {
    super(config.game);
    this.initComponents(config);
    this.setCoordinates(config);
    this.update(config);
  }

  /**
   * Instantiate the components
   * @param {object} config - configuration object to specify the button
   */
  initComponents(config) {
    const {
      size,
      onClick,
      customOverFrame,
      customOutFrame,
      customDownFrame,
      fixedToCamera,
      label,
    } = config;

    const frames = BUTTON.sizes[size || 'sm'];
    const callback = () => onClick && onClick.call(this);
    const over = customOverFrame || frames.over;
    const out = customOutFrame || frames.out;
    const down = customDownFrame || frames.down;

    this.sprite = this.game.add.button(
      0,
      0,
      BUTTON.spritesheet.id,
      callback,
      this,
      over,
      out,
      down,
    );
    this.sprite.anchor.set(0.5);

    if (fixedToCamera) {
      this.fixedToCamera = true;
    }

    this.text = this.game.add.text(0, 0, label, {
      ...BUTTON.style,
      wordWrapWidth: this.sprite.width,
    });
    this.text.anchor.set(0.5);

    this.add(this.sprite);
    this.add(this.text);
  }

  setCoordinates({ x, y, fixedToCamera }) {
    const cX = x || ns.window.width / 2;
    const cY = y || ns.window.height / 2;
    this.x = cX;
    this.y = cY;
    if (fixedToCamera) {
      this.fixedToCamera = true;
      this.cameraOffset.setTo(cX, cY);
    }
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

export default Button;
