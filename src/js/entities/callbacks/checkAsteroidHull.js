import { install } from '../../common/CallbackCollection';

const HULL_TRESHOLD = 250;

/**
 * Rainbow table to indicate which entity must be changed when
 * have the hull falls belowe the given treshold
 */
const RULES = {
  asteroidsilicon1: 'asteroidsiliconsmall1',
  asteroidsilicon2: 'asteroidsiliconsmall2',
  asteroidtitanium1: 'asteroidtitaniumsmall1',
  asteroidtitanium2: 'asteroidtitaniumsmall2',
  asteroiduranium1: 'asteroiduraniumsmall1',
  asteroiduranium2: 'asteroiduraniumsmall2',
};

/**
 * Checks if the given entity (resource astroid) has euqal or less
 * than 250 Hull
 * @param {object} entity - Entity instance
 */
function checkAsteroidHull(entity) {
  const DO = entity.getDataObject();
  const id = DO.getId();
  if (DO.getHull() <= HULL_TRESHOLD && RULES[id]) {
    const newSprite = RULES[id];
    entity.replaceSprite(newSprite);
  }
}

install(checkAsteroidHull);
