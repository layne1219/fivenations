/* global window */
import Star from './Star';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import Util from '../common/Util';

const NUMBER_OF_STARS_PER_SCREEN = 10;
const ns = window.fivenations;
const { width, height } = ns.window;
let sprite;

function getRandomizedZ() {
  const z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
  return z;
}

function createStar() {
  const z = getRandomizedZ();
  const star = new Star()
    .setX(Util.rnd(0, width))
    .setY(Util.rnd(0, height))
    .setZ(z)
    .setSprite(sprite);

  return star;
}

class StarGenerator extends SpaceObjectGenerator {
  constructor(game) {
    super(game);
    this.createSprites();
    this.createStars();
  }

  createSprite() {
    if (sprite) return;
    sprite = this.game.make.sprite(0, 0, 'starfield.stars');
  }

  createStars() {
    let star;
    for (let i = 0; i < NUMBER_OF_STARS_PER_SCREEN; i += 1) {
      star = createStar();
      this.addSpaceObject(star);
    }
  }
}

export default StarGenerator;
