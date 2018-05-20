/* global Phaser */
import EventEmitter from '../sync/EventEmitter';

const style = {
  font: '11px BerlinSansFB-Reg',
  fill: '#FFFFFF',
  boundsAlignH: 'center',
};

class ResourceGroup extends Phaser.Group {
  constructor(config, phaserGame) {
    super(phaserGame);
    this.initTextComponents(config, phaserGame);
  }

  initTextComponents(config = {}, phaserGame) {
    this.textGroup = this.add(phaserGame.add.text(config.x || 0, config.y || 0, '', style));
    this.textGroup.setTextBounds(0, 0, 60, 15);
  }

  updateContent(values = {}) {
    const { current, max } = values;

    this.textGroup.text = current || 0;
    if (max) {
      this.textGroup.text += ` / ${max}`;
    }
    this.textGroup.addColor('#FFFFFF', 0);
    // this.textGroup.addColor('#475D86', current.toString().length + 1);
  }
}

export default class ResourceDisplay extends Phaser.Group {
  /**
   * Constructor
   * @param {object} config destructured to
   * phaserGame reference to the Phaser.Game instance
   * playerManager [reference to the singleton instance of PlayerManager]
   */
  constructor({ playerManager, phaserGame }) {
    super(phaserGame);
    this.setPlayerManager(playerManager);
    this.initTextElements(phaserGame);
    this.registerEventListeners();
  }

  setPlayerManager(playerManager) {
    this.playerManager = playerManager;
  }

  initTextElements(phaserGame) {
    this.titanium = new ResourceGroup({ x: -82, y: 0 }, phaserGame);
    this.add(this.titanium);

    this.silicium = new ResourceGroup({ x: 13, y: 0 }, phaserGame);
    this.add(this.silicium);

    this.energy = new ResourceGroup({ x: 105, y: 0 }, phaserGame);
    this.add(this.energy);

    this.uranium = new ResourceGroup({ x: 200, y: 0 }, phaserGame);
    this.add(this.uranium);

    this.food = new ResourceGroup({ x: 294, y: 0 }, phaserGame);
    this.add(this.food);
  }

  registerEventListeners() {
    const emitter = EventEmitter.getInstance();
    emitter.local.addEventListener(
      'user/resource/alter',
      this.updateContent.bind(this),
    );
  }

  updateContent() {
    const user = this.playerManager.getUser();
    this.titanium.updateContent({ current: user.getTitanium() });
    this.silicium.updateContent({ current: user.getSilicium() });
    this.energy.updateContent({ current: user.getEnergy() });
    this.uranium.updateContent({ current: user.getUranium() });
    this.food.updateContent({
      current: user.getCurrentEntityNumber(),
      max: user.getSupply(),
    });
  }

  /**
   * Appends the ResourceDisplay to the main Panel element
   * @param  {object} panel [Panel]
   * @param  {integer} x [horizontal offset of the ControlPanel element on the Panel]
   * @param  {integer} y [vertical offset of the ControlPanel element on the Panel]
   * @return {void}
   */
  appendTo(panel, x, y) {
    if (!panel) {
      throw new Error('Invalid Phaser.Sprite object!');
    }

    this.x = x;
    this.y = y;
    panel.addChild(this);

    this.panel = panel;
  }
}
