import Graphics from '../common/Graphics';

const BACKGROUND_SPEED = 0.1;

function Background(map) {
    initialise.call(this, map);
}

function initialise(map) {
    this.game = map.getGame();
    this.background = this.game.add.tileSprite(0, 0, 1024, 1024, 'starfield');
    this.background.fixedToCamera = true;

    Graphics.getInstance().getGroup('starfield').add(this.background);
}

Background.prototype = {

    update: function() {
        this.background.tilePosition.x = -this.game.camera.x * BACKGROUND_SPEED;
        this.background.tilePosition.y = -this.game.camera.y * BACKGROUND_SPEED;
    }

};

export default Background;
