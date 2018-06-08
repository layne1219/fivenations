/* global Phaser, window */
import EventEmitter from '../sync/EventEmitter';
import PlayerManager from '../players/PlayerManager';

const ns = window.fivenations;

// icons for resources
const ICON_SPRITE = 'gui';
const ICON_SPRITE_HD = 'gui-hd';
const ICON_TITANIUM = 'gui_resource_01_titanium.png';
const ICON_SILICIUM = 'gui_resource_02_silicium.png';
const ICON_URANIUM = 'gui_resource_03_uranium.png';
const ICON_ENERGY = 'gui_resource_04_energy.png';
const ICON_SUPPLY = 'gui_resource_05_place.png';
const ICON_BG_FRAME = 'gui_panel_resourceback.png';

const style = {
  font: '13px BerlinSansFB-Reg',
  fill: '#FFFFFF',
  boundsAlignH: 'center',
};

class ResourceGroup extends Phaser.Group {
  constructor(config) {
    super(ns.game.game);
    this.initResourceComponents(config);
  }

  initResourceComponents(config = {}) {
    const iconBg = this.game.add.sprite(
      config.x - 18,
      config.y + 7,
      ICON_SPRITE_HD,
    );
    iconBg.anchor.set(0.5);
    iconBg.frameName = ICON_BG_FRAME;
    this.add(iconBg);

    const icon = this.game.add.sprite(iconBg.x, iconBg.y, ICON_SPRITE);
    icon.anchor.set(0.5);
    icon.frameName = config.icon;
    this.icon = this.add(icon);

    const text = this.game.add.text(config.x || 0, config.y || 0, '', style);
    this.textGroup = this.add(text);
    this.textGroup.setTextBounds(0, 0, 60, 15);
  }

  updateContent(values = {}) {
    const { current, max } = values;

    this.textGroup.text = current || 0;
    if (max !== undefined) {
      this.textGroup.text += ` / ${max}`;
    }
    this.textGroup.addColor('#FFFFFF', 0);
    // this.textGroup.addColor('#475D86', current.toString().length + 1);
  }
}

export default class ResourceDisplay extends Phaser.Group {
  constructor() {
    super(ns.game.game);
    this.setPlayerManager();
    this.initTextElements();
    this.registerEventListeners();
  }

  setPlayerManager() {
    this.playerManager = PlayerManager.getInstance();
  }

  initTextElements() {
    this.titanium = new ResourceGroup({ icon: ICON_TITANIUM, x: -82, y: 0 });
    this.add(this.titanium);

    this.silicium = new ResourceGroup({ icon: ICON_SILICIUM, x: 13, y: 0 });
    this.add(this.silicium);

    this.uranium = new ResourceGroup({ icon: ICON_URANIUM, x: 105, y: 0 });
    this.add(this.uranium);

    this.energy = new ResourceGroup({ icon: ICON_ENERGY, x: 200, y: 0 });
    this.add(this.energy);

    this.food = new ResourceGroup({ icon: ICON_SUPPLY, x: 294, y: 0 });
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
    this.energy.updateContent({
      current: user.getEnergy(),
      max: user.getMaxEnergyStorage(),
    });
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
