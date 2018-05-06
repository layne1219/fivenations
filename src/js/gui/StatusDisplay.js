import StatusBar from './StatusBar';
import CargoDisplay from './CargoDisplay';
import Graphics from '../common/Graphics';

let phaserGame;

// icons for cargo displays
const ICON_TITANIUM = 'gui_resource_01_titanium.png';
const ICON_SILICIUM = 'gui_resource_02_silicium.png';
const ICON_URANIUM = 'gui_resource_03_uranium.png';

// color keys for cargo texts
const COLOR_TITANIUM = '#FFFFFF';
const COLOR_SILICIUM = '#FFFFFF';
const COLOR_URANIUM = '#FFFFFF';

/**
 * Returns whether the given entity can carry or has cargo
 * @paran {object} entity - Entity instance
 * @return {boolean}
 */
function canCarryCargo(entity) {
  const dataObject = entity.getDataObject();
  return (
    dataObject.getCargoCapacity() ||
    dataObject.getCargoTitanium() ||
    dataObject.getCargoSilicium() ||
    dataObject.getCargoUranium()
  );
}

export default class StatusDisplay {
  constructor(_phaserGame) {
    phaserGame = _phaserGame;

    // creating the group for the individual StatusBar objects
    this.group = phaserGame.add.group();
    this.group.visible = false;

    Graphics.getInstance()
      .getGroup('prior-gui-elements')
      .add(this.group);
  }

  /**
   * attaching the StatusDisplay to an entity
   * @param  {[object]} entity [reference to an instance of an Entity]
   * @return {[void]}
   */
  appendTo(entity) {
    const dataObject = entity.getDataObject();
    const height = dataObject.getHeight();
    const width = Math.max(dataObject.getWidth(), height);

    // Shield if there is any
    if (dataObject.getMaxShield() > 0) {
      this.shieldBar = new StatusBar({ color: '0x0000FF', width, phaserGame });
      this.shieldBar.getGroup().x = this.shieldBar.getGroup().width / -2;
      this.shieldBar.getGroup().y = -height;
      this.group.add(this.shieldBar.getGroup());
    }
    // Health
    this.healthBar = new StatusBar({ width, phaserGame });
    this.healthBar.getGroup().x = this.healthBar.getGroup().width / -2;
    this.healthBar.getGroup().y = -height + this.group.children.length * 6;
    this.group.add(this.healthBar.getGroup());

    // Power if there is any
    if (dataObject.getMaxPower() > 0) {
      this.powerBar = new StatusBar({ color: '0xFF00FF', width, phaserGame });
      this.powerBar.getGroup().x = this.powerBar.getGroup().width / -2;
      this.powerBar.getGroup().y = -height + this.group.children.length * 6;
      this.group.add(this.powerBar.getGroup());
    }

    if (canCarryCargo(entity) > 0) {
      const cargoOffsetX = this.healthBar.getGroup().x;
      // Titanium Cargo
      this.cargoTitanium = new CargoDisplay(
        phaserGame,
        ICON_TITANIUM,
        COLOR_TITANIUM,
      );
      this.cargoTitanium.x = cargoOffsetX;
      this.group.add(this.cargoTitanium);

      // Silicium Cargo
      this.cargoSilicium = new CargoDisplay(
        phaserGame,
        ICON_SILICIUM,
        COLOR_SILICIUM,
      );
      this.cargoSilicium.x = cargoOffsetX;
      this.group.add(this.cargoSilicium);

      // Uranium Cargo
      this.cargoUranium = new CargoDisplay(
        phaserGame,
        ICON_URANIUM,
        COLOR_URANIUM,
      );
      this.cargoUranium.x = cargoOffsetX;
      this.group.add(this.cargoUranium);
    }

    // registers event listeners against entity events
    entity.on('select', this.show.bind(this));
    entity.on('unselect', this.hide.bind(this));
    entity.on('damage', this.update.bind(this));
    entity.on('remove', this.remove.bind(this));
    entity.on('updateCargo', this.update.bind(this));

    // the sprite is not a child of the entity for various overlapping issues
    // therefore it needs to follow it upon every tick
    this.group.update = function update() {
      this.x = entity.getSprite().x;
      this.y = entity.getSprite().y;
    };

    this.parent = entity;
  }

  /**
   * Updates the bars above the entity
   */
  updateBars() {
    const dataObject = this.parent.getDataObject();
    let ratio;

    if (this.healthBar) {
      ratio = dataObject.getHull() / dataObject.getMaxHull();
      this.healthBar.update(ratio);
    }

    if (this.shieldBar) {
      ratio = dataObject.getShield() / dataObject.getMaxShield();
      this.shieldBar.update(ratio);
    }

    if (this.powerBar) {
      ratio = dataObject.getPower() / dataObject.getMaxPower();
      this.powerBar.update(ratio);
    }
  }

  /**
   * Updates the cargo data
   */
  updateCargo() {
    const dataObject = this.parent.getDataObject();
    const height = dataObject.getHeight();
    const titanium = dataObject.getCargoTitanium();
    const silicium = dataObject.getCargoSilicium();
    const uranium = dataObject.getCargoUranium();
    let cargoOffset = height / 2;

    if (this.cargoTitanium) {
      if (titanium > 0) {
        this.cargoTitanium.update(titanium);
        this.cargoTitanium.y = cargoOffset;
        this.cargoTitanium.visible = true;
        cargoOffset += this.cargoTitanium.height * 0.75;
      } else {
        this.cargoTitanium.visible = false;
      }
    }

    if (this.cargoSilicium) {
      if (silicium > 0) {
        this.cargoSilicium.update(silicium);
        this.cargoSilicium.y = cargoOffset;
        this.cargoSilicium.visible = true;
        cargoOffset += this.cargoSilicium.height * 0.75;
      } else {
        this.cargoSilicium.visible = false;
      }
    }

    if (this.cargoUranium) {
      if (uranium > 0) {
        this.cargoUranium.update(uranium);
        this.cargoUranium.y = cargoOffset;
        this.cargoUranium.visible = true;
      } else {
        this.cargoUranium.visible = false;
      }
    }
  }

  /**
   * Refreshes the graphics objects according to the current values of
   * the exposed abilities of the entity
   * @return {[void]}
   */
  update() {
    this.updateBars();
    this.updateCargo();
  }

  /**
   * Making the StatusDisplay visible
   * @return {[void]}
   */
  show() {
    this.update();
    this.group.visible = true;
  }

  /**
   * Making the StatusDisplay unvisible
   * @return {[void]}
   */
  hide() {
    this.group.visible = false;
  }

  /**
   * remove the group from the Phaser render layer
   * @return {[void]}
   */
  remove() {
    this.group.destroy(true); // true for destroying all the children
  }
}
