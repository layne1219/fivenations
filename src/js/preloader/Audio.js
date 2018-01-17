import { Sprites, PreloadedSprites } from '../audio/Sprites';

const { PUBLIC_URL } = process.env;

export default {
  /**
   * Loads all audio sprites that is labelled as preloadable
   * @param {object} preloader - Phaser Preloader object
   */
  load(preloader) {
    PreloadedSprites.forEach((key) => {
      preloader.load.audio(key, `${PUBLIC_URL}/${Sprites[key].asset}`);
    });
  },
};
