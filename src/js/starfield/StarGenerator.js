/* global window */
import Star from './Star';
import SpaceObjectGenerator from './SpaceObjectGenerator';
import Util from '../common/Util';

const NUMBER_OF_STAR_TYPES = 7;
const NUMBER_OF_STARS_PER_SCREEN = 50;
const ns = window.fivenations;

function getRandomizedZ() {
  const z = Math.min(Math.random() + 0.05, 0.5);
  return z;
}

class StarGenerator extends SpaceObjectGenerator {
  generate() {
    this.createStars();
  }

  createRandomStarSprite() {
    const sprite = this.deepSpaceLayer.getSprite('starfield.stars');
    const phaserGame = ns.game.game;
    const starFrame = Util.rnd(0, NUMBER_OF_STAR_TYPES - 1);
    sprite.frame = starFrame;
    const clone = phaserGame.make.sprite(0, 0, sprite.generateTexture());
    return clone;
  }

  createStar() {
    const { width, height } = ns.window;
    const starSprite = this.createRandomStarSprite();
    const z = getRandomizedZ();
    const star = new Star(starSprite)
      .setX(Util.rnd(0, width))
      .setY(Util.rnd(0, height))
      .setZ(z);

    return star;
  }

  createStars() {
    for (let i = 0; i < NUMBER_OF_STARS_PER_SCREEN; i += 1) {
      const star = this.createStar();
      this.addSpaceObject(star);
    }
  }
}

export default StarGenerator;
