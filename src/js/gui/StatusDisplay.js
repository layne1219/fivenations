import StatusBar from './StatusBar';
import Graphics from '../common/Graphics';

let phaserGame;

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
    const height = entity.getDataObject().getHeight();
    const width = Math.max(entity.getDataObject().getWidth(), height);

    // Shield if there is any
    if (entity.getDataObject().getMaxShield() > 0) {
      this.shieldBar = new StatusBar({ color: '0x0000FF', width, phaserGame });
      this.shieldBar.getGroup().x = this.shieldBar.getGroup().width / -2;
      this.shieldBar.getGroup().y = -height;
      this.group.add(this.shieldBar.getGroup());
    }
    // Health
    this.healthBar = new StatusBar({ width, phaserGame });
    this.healthBar.getGroup().x = this.healthBar.getGroup().width / -2;
    this.healthBar.getGroup().y = -height + (this.group.children.length * 6);
    this.group.add(this.healthBar.getGroup());

    // Power if there is any
    if (entity.getDataObject().getMaxPower() > 0) {
      this.powerBar = new StatusBar({ color: '0xFF00FF', width, phaserGame });
      this.powerBar.getGroup().x = this.powerBar.getGroup().width / -2;
      this.powerBar.getGroup().y = -height + (this.group.children.length * 6);
      this.group.add(this.powerBar.getGroup());
    }

    entity.on('select', this.show.bind(this));
    entity.on('unselect', this.hide.bind(this));
    entity.on('damage', this.update.bind(this));
    entity.on('remove', this.remove.bind(this));

    // the sprite is not a child of the entity for various overlapping issues
    // therefore it needs to follow it upon every tick
    this.group.update = () => {
      this.x = entity.getSprite().x;
      this.y = entity.getSprite().y;
    };

    this.parent = entity;
  }

  /**
   * Refresing the graphics objects according to the current values of
   * the exposed abilities of the entity
   * @return {[void]}
   */
  update() {
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
