const ns = window.fivenations;
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

  initTextComponents(config, phaserGame) {
    if (!config) config = {};
    this.textGroup = this.add(phaserGame.add.text(config.x || 0, config.y || 0, '', style));
    this.textGroup.setTextBounds(0, 0, 60, 15);
  }

  updateContent(values) {
    let current,
      max;
    if (!values) values = {};

    current = values.current || 0;
    max = values.max;

    this.textGroup.text = current;
    if (max) {
      this.textGroup.text += `/${max}`;
    }
    this.textGroup.addColor('#FFFFFF', 0);
    this.textGroup.addColor('#475D86', current.toString().length + 1);
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
    this.titanium = new ResourceGroup({ x: 0, y: 0 }, phaserGame);
    this.add(this.titanium);

    this.silicium = new ResourceGroup({ x: 76, y: 0 }, phaserGame);
    this.add(this.silicium);

    this.energy = new ResourceGroup({ x: 152, y: 0 }, phaserGame);
    this.add(this.energy);

    this.uranium = new ResourceGroup({ x: 228, y: 0 }, phaserGame);
    this.add(this.uranium);

    this.food = new ResourceGroup({ x: 304, y: 0 }, phaserGame);
    this.add(this.food);
  }

  registerEventListeners() {
    ns.game.signals.onPlayerResourcesUpdate.add(this.updateContent, this);
  }

  updateContent() {
    const user = this.playerManager.getUser();
    this.titanium.updateContent({ current: user.getTitanium() });
    this.silicium.updateContent({ current: user.getSilicium() });
    this.energy.updateContent({ current: user.getEnergy() });
    this.uranium.updateContent({ current: user.getUranium() });
    this.food.updateContent({ current: user.getCurrentEntityNumber() });
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
      throw 'Invalid Phaser.Sprite object!';
    }

    this.x = x;
    this.y = y;
    panel.addChild(this);

    this.panel = panel;
  }
}
