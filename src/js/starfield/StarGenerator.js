/* global window */
import Star from './Star';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import Util from '../common/Util';

const NUMBER_OF_STARS_PER_SCREEN = 10;
const ns = window.fivenations;
const { width, height } = ns.window;
let sprites;

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
    throw new Error('Invalid sprite was given for a Star object!');
  }
  return sprites[key][index];
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

class StarGenerator extends SpaceObjectGenerator {
  constructor(game) {
    super(game);
    this.createSprites();
    this.createStars();
  }

  createSprites() {
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

  createStars() {
    let star;
    for (let i = 0; i < NUMBER_OF_STARS_PER_SCREEN; i += 1) {
      star = createStar();
      this.addSpaceObject(star);
    }
  }
}

export default StarGenerator;
