import { DEFAULT_STARFIELD_BACKGROUND_TILE } from '../common/Const';
import Graphics from '../common/Graphics';

const BACKGROUND_SPEED = 0.1;

class Background {
  constructor(map, tile) {
    this.initialise(map, tile);
  }

  initialise(map, tile = DEFAULT_STARFIELD_BACKGROUND_TILE) {
    this.setGame(map);
    this.setGroup();
    this.setTile(tile);
  }

  setGame(map) {
    this.game = map.getGame();
  }

  setGroup() {
    this.group = Graphics.getInstance().getGroup('starfield');
  }

  setTile(tile) {
    // removes the current one if exsists
    if (this.background) {
      this.remove();
    }
    this.background = this.game.add.tileSprite(0, 0, 1024, 1024, tile);
    this.background.fixedToCamera = true;
    this.group.add(this.background);
  }

  update() {
    this.background.tilePosition.x = -this.game.camera.x * BACKGROUND_SPEED;
    this.background.tilePosition.y = -this.game.camera.y * BACKGROUND_SPEED;
  }

  remove() {
    this.group.remove(this.background);
    this.background.destroy();
  }
}

export default Background;
