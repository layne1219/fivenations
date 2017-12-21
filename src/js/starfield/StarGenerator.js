import Star from './Star';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import Util from '../common/Util';

const NUMBER_OF_STARS_PER_SCREEN = 10;
const ns = window.fivenations;
const width = ns.window.width;
const height = ns.window.height;
let sprites;

function StarGenerator(game) {
  SpaceObjectGenerator.call(this, game);
  createSprites.call(this);
  createStars.call(this);
}

StarGenerator.prototype = Object.create(SpaceObjectGenerator.prototype);
StarGenerator.prototype.constructor = StarGenerator;

function createSprites() {
  if (sprites) return;

  sprites = {
    mediate: [
      this.game.make.sprite(0, 0, 'starfield.star.big-1'),
      this.game.make.sprite(0, 0, 'starfield.star.big-2'),
      this.game.make.sprite(0, 0, 'starfield.star.big-3'),
    ],
    slow: [
      this.game.make.sprite(0, 0, 'starfield.star.small-1'),
      this.game.make.sprite(0, 0, 'starfield.star.small-2'),
      this.game.make.sprite(0, 0, 'starfield.star.small-3'),
    ],
  };
}

function createStars() {
  let star,
    i;
  for (i = 0; i < NUMBER_OF_STARS_PER_SCREEN; i += 1) {
    star = createStar();
    this.addSpaceObject(star);
  }
}

function createStar() {
  const z = getRandomizedZ();
  const sprite = getSpriteFromZ(z);
  const star = new Star()
    .setX(Util.rnd(0, width))
    .setY(Util.rnd(0, height))
    .setZ(z)
    .setSprite(sprite);

  return star;
}

function getRandomizedZ() {
  const z = Math.min(Math.random() + 0.1, Math.random() > 0.5 ? 0.25 : 0.6);
  return z;
}

function getSpriteFromZ(z) {
  const index = Util.rnd(0, 3);
  let key = 'slow';

  if (z >= 0.34 && z <= 0.65) {
    key = 'mediate';
  } else if (z > 0.65) {
    key = 'fast';
  }
  if (!sprites[key] || !sprites[key][index]) {
    throw 'Invalid sprite was given for a Star object!';
  }
  return sprites[key][index];
}

export default StarGenerator;
