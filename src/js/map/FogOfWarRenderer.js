/* global window */
import Graphics from '../common/Graphics';
import { GROUP_FOGOFWAR } from '../common/Const';

const ns = window.fivenations;

class FogOfWarRenderer {
  constructor(fogOfWar) {
    this.linkGame(fogOfWar);
    this.addFogOfWar(fogOfWar);
    this.initBitMapData();
    this.initMask();
  }

  linkGame(fogOfWar) {
    const map = fogOfWar.getMap();
    this.game = map.getGame();
  }

  initBitMapData() {
    const group = Graphics.getInstance().getGroup(GROUP_FOGOFWAR);
    const screenWidth = ns.window.width;
    const screenHeight = ns.window.height;

    this.bmd = this.game.add.bitmapData(screenWidth, screenHeight);
    this.body = this.bmd.addToWorld(0, 0);
    this.body.fixedToCamera = true;

    group.add(this.body);
  }

  addFogOfWar(fogOfWar) {
    this.fogOfWar = fogOfWar;
    this.tileSize = fogOfWar.getMap().getTileWidth();
  }

  initMask() {
    const maskSize = this.tileSize * 6;
    this.mask = this.game.add.bitmapData(maskSize, maskSize);
    this.mask.clear();

    const grd = this.mask.context.createRadialGradient(
      maskSize / 2,
      maskSize / 2,
      this.tileSize * 0.75,
      maskSize / 2,
      maskSize / 2,
      maskSize / 2,
    );
    grd.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.mask.context.fillStyle = grd;
    this.mask.context.fillRect(0, 0, maskSize, maskSize);
  }

  getVisibleChunk() {
    const visibleMatrixWidth = Math.floor(this.bmd.width / this.tileSize);
    const visibleMatrixHeight = Math.floor(this.bmd.height / this.tileSize);
    const offsetHoriztal = Math.floor(this.game.camera.x / this.tileSize);
    const offsetVertical = Math.floor(this.game.camera.y / this.tileSize);

    return this.fogOfWar.getMatrixChunk({
      x: offsetHoriztal - 1,
      y: offsetVertical - 1,
      width: visibleMatrixWidth + 1,
      height: visibleMatrixHeight + 1,
    });
  }

  update() {
    this.clear();
    this.bmd.blendDestinationOut();

    const cameraOffsetX = this.game.camera.x % this.tileSize;
    const cameraOffsetY = this.game.camera.y % this.tileSize;
    const matrix = this.getVisibleChunk();
    const maskSize = this.mask.width;
    const maskOffset = maskSize / 2;

    for (let i = 0; i < matrix.length; i += 1) {
      for (let j = 0; j < matrix[i].length; j += 1) {
        if (matrix[i][j]) {
          // offset to render one line of tiles off screen
          // so as to display the gradient transition
          this.bmd.draw(
            this.mask,
            (j - 1) * this.tileSize - maskOffset - cameraOffsetX,
            (i - 1) * this.tileSize - maskOffset - cameraOffsetY,
          );
        }
      }
    }

    this.bmd.dirty = true;
  }

  clear() {
    this.bmd.clear();
    this.bmd.context.fillStyle = '#000000';
    this.bmd.context.globalCompositeOperation = 'source-over';
    this.bmd.context.fillRect(0, 0, this.bmd.width, this.bmd.height);
  }
}

export default FogOfWarRenderer;
