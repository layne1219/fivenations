/* global Phaser, window */
import Graphics from '../common/Graphics';
import EventEmitter from '../sync/EventEmitter';

const ns = window.fivenations;

class ProximityMonitor extends Phaser.Group {
  constructor() {
    super(ns.game.game);
    this.addEventListeners();
    this.hide();
  }

  /**
   * Creates the bitmapdata and context to draw onto
   * @param {object} entity - Entity instance
   */
  createProximityDisplay(entity) {
    const width = entity.getDataObject().getConstructionProximity();
    this.bmd = this.game.add.bitmapData(width, width);
    this.sprite = this.bmd.addToWorld(0, 0);
    this.sprite.alpha = 0.4;
    this.add(this.sprite);

    this.drawProximityDisplay(entity);
  }

  /**
   * Draws the gradient circle that represents the proximity
   * @param {object} entity - Entity instance
   */
  drawProximityDisplay(entity) {
    const ctx = this.bmd.context;
    const width = entity.getDataObject().getConstructionProximity();
    const cx = width / 2;
    const r = cx * 0.75;
    const gradient = ctx.createRadialGradient(cx, cx, r, cx, cx, cx);
    gradient.addColorStop(0, '#77C7D2');
    gradient.addColorStop(1, 'rgba(119, 199, 210, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, width);
  }

  /**
   * Registers the default event listeners
   */
  addEventListeners() {
    const emitter = EventEmitter.getInstance().local;
    emitter.addEventListener(
      'gui/buildingplacement/show',
      this.show.bind(this),
    );
    emitter.addEventListener(
      'gui/buildingplacement/hide',
      this.hide.bind(this),
    );
  }

  /**
   * Appends the group to the given entity
   * @param {object} entity - Entity to attach the monitor to
   */
  appendTo(entity) {
    // Add the selection to the appropriate graphics group as per its type
    const groupName = 'color-indicators';
    Graphics.getInstance()
      .getGroup(groupName)
      .add(this.sprite);

    entity.on('remove', this.remove.bind(this));
    entity.on('hibernate', this.hide.bind(this));
    entity.on('reactivated', this.show.bind(this));

    // the sprite is not a child of the entity for various overlapping issues
    // therefore it needs to follow it upon every tick
    this.sprite.update = function update() {
      this.x = entity.getSprite().x;
      this.y = entity.getSprite().y;
    };

    this.parent = entity;

    this.createProximityDisplay(entity);
  }

  /**
   * Makes the group visible
   */
  show() {
    this.visible = true;
  }

  /**
   * Makes the group invisible
   */
  hide() {
    this.visible = false;
  }

  /**
   * Destroys the group and all its children
   */
  remove() {
    this.destroy(true);
  }
}

export default ProximityMonitor;
