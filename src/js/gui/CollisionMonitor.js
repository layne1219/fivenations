/* global window, Phaser */
import { TILE_WIDTH, TILE_HEIGHT } from '../common/Const';

const MAX_SIZE_IN_TILES = 6;

const ns = window.fivenations;

/**
 * Realises the collision monitor for the building placement display
 */
class CollisionMonitor extends Phaser.Group {
  constructor() {
    super(ns.game.game);
    this.bmd = this.game.add.bitmapData(
      MAX_SIZE_IN_TILES * TILE_WIDTH,
      MAX_SIZE_IN_TILES * TILE_HEIGHT,
    );
    this.sprite = this.bmd.addToWorld(0, 0);
    this.sprite.alpha = 0.4;
    this.add(this.sprite);
  }

  /**
   * Draws rectangles based on the given matrix indicating which tile
   * in the collection is occupied
   * @param {object} tiles - matrix of numbers representing a given
   * chunk of the collision map
   */
  drawTiles(tiles) {
    let fillStyle;
    let x;
    let y;

    this.bmd.clear();

    for (let i = tiles.length - 1; i >= 0; i -= 1) {
      for (let j = tiles[i].length - 1; j >= 0; j -= 1) {
        if (tiles[i][j]) {
          fillStyle = '#ff0000';
        } else {
          fillStyle = '#77C7D2';
        }
        x = j * TILE_WIDTH;
        y = i * TILE_HEIGHT;
        this.bmd.context.fillStyle = fillStyle;
        this.bmd.context.fillRect(x, y, TILE_WIDTH, TILE_HEIGHT);
      }
    }
  }
}

export default CollisionMonitor;
