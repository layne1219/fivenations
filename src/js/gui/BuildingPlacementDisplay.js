/* global window, Phaser */
import UserPointer from './UserPointer';
import CollisionMonitor from './CollisionMonitor';
import { getDimensionsBySize } from '../model/DataObject';
import { TILE_WIDTH, TILE_HEIGHT } from '../common/Const';

const ns = window.fivenations;

// frame to be shown when the entities are displayed
const DEFAULT_FRAME = 4;

/**
 * Realises the building placement display
 */
class BuildingPlacementDisplay extends Phaser.Group {
  constructor() {
    super(ns.game.game);
    this.collisionMonitor = new CollisionMonitor();
    this.add(this.collisionMonitor);
  }

  /**
   * Activates the display by the given Entity id
   * @param {string} entityId - Id of the entity to be placed
   */
  activate(entityId) {
    if (!entityId) return;
    this.setEntityId(entityId);
    this.createSpriteById(entityId);
    this.setEntityCollisionDimensionsById(entityId);
    this.addEventListeners();
    this.show();
  }

  /**
   * Deactivates the display removing the corresponding elements
   */
  deactivate() {
    this.removeSprite();
    this.removeEventListeners();
    this.hide();
  }

  /**
   * Sets the id of the selected entity (building)
   * @param {string} id - Id of the selected Entity
   */
  setEntityId(id) {
    this.entityId = id;
  }

  /**
   * Creates a sprite to be displayed on mouse move at the pointer
   * to display where the entity (building) will be constructed
   * @param {string} id - Id of the entity to be shown
   */
  createSpriteById(id) {
    this.sprite = this.game.add.sprite(0, 0, id);
    this.sprite.frame = DEFAULT_FRAME;
    this.sprite.anchor.set(0.5);
    this.add(this.sprite);
  }

  /**
   * Fetches and sets the collision data of the given entity
   * @param {string} id - Id of the entity to be shown
   */
  setEntityCollisionDimensionsById(id) {
    const data = this.game.cache.getJSON(id);
    const dimensions = getDimensionsBySize(data);
    const width = Math.max(Math.floor(dimensions.width / TILE_WIDTH), 1) + 1;
    const height = Math.max(Math.floor(dimensions.height / TILE_HEIGHT), 1) + 1;

    this.collisionTileWidth = width;
    this.collisionTileHeight = height;
  }

  /**
   * Registers event listeners against the UserPointer instance
   */
  addEventListeners() {
    const pointer = UserPointer.getInstance();
    this.onMoveCallback = this.followMouse.bind(this);
    pointer.on('move', this.onMoveCallback);
  }

  /**
   * Callback that is invoked on every mouse move
   * @param {object} pointer - UserPointer instance
   */
  followMouse(pointer) {
    const collisionMap = ns.game.map.getCollisionMap();
    const mapWidth = ns.game.map.getWidth();
    const mapHeight = ns.game.map.getHeight();
    const { x, y } = pointer.getRealCoords();

    const collisionWidth = this.collisionTileWidth;
    const collisionHeight = this.collisionTileHeight;
    const collisionWidthHalf = Math.floor(collisionWidth / 2);
    const collisionHeightHalf = Math.floor(collisionHeight / 2);

    const tileX = Math.min(
      Math.max(Math.floor(x / TILE_WIDTH), collisionWidthHalf),
      mapWidth - collisionWidthHalf,
    );
    const tileY = Math.min(
      Math.max(Math.floor(y / TILE_HEIGHT), collisionHeightHalf),
      mapHeight - collisionHeightHalf,
    );

    const startX = tileX - collisionWidthHalf;
    const startY = tileY - collisionHeightHalf;
    const tiles = collisionMap.getMatrixChunk({
      x: startX,
      y: startY,
      width: collisionWidth,
      height: collisionHeight,
    });

    this.tiles = tiles;

    this.collisionMonitor.x = startX * TILE_WIDTH;
    this.collisionMonitor.y = startY * TILE_HEIGHT;
    this.collisionMonitor.drawTiles(tiles);

    this.sprite.x = startX * TILE_WIDTH + collisionWidth * TILE_WIDTH / 2;
    this.sprite.y = startY * TILE_HEIGHT + collisionHeight * TILE_HEIGHT / 2;
  }

  /**
   * Removes the sprite that represents the currently selected
   * entity from the group
   */
  removeSprite() {
    if (!this.sprite) return;
    this.remove(this.sprite);
    this.sprite.destroy();
  }

  /**
   * Detaches event listeners against the UserPointer instance
   */
  removeEventListeners() {
    const pointer = UserPointer.getInstance();
    if (this.onMoveCallback) {
      pointer.remove('move', this.onMoveCallback);
      this.onMoveCallback = undefined;
    }
  }

  /**
   * Makes the placement display visible
   */
  show() {
    this.visible = true;
  }

  /**
   * Makes the placement display hidden
   */
  hide() {
    this.visible = false;
  }

  /**
   * Attaches the Panel object to the a random Phaser.Game element
   * @param {object} panel Main GUI Group
   * @return {void}
   */
  appendTo(parent) {
    parent.add(this);
  }
}

export default BuildingPlacementDisplay;
