import Graphics from '../common/Graphics';

const BACKGROUND_SPEED = 0.1;

class Background {
  constructor(map) {
    this.initialise(map);
  }

  initialise(map) {
    this.game = map.getGame();
    this.background = this.game.add.tileSprite(0, 0, 1024, 1024, 'starfield');
    this.background.fixedToCamera = true;

    Graphics.getInstance()
      .getGroup('starfield')
      .add(this.background);
  }
  update() {
    this.background.tilePosition.x = -this.game.camera.x * BACKGROUND_SPEED;
    this.background.tilePosition.y = -this.game.camera.y * BACKGROUND_SPEED;
  }
}

export default Background;
