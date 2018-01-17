import { SUPPORTED_LOCALES } from '../common/Const';

const { PUBLIC_URL } = process.env;

export default {
  /**
   * Loads all available translation files
   * @param {object} preloader - Phaser Preloader object
   */
  load(preloader) {
    SUPPORTED_LOCALES.forEach((key) => {
      preloader.load.json(key, `${PUBLIC_URL}/translations/${key}.json`);
    });
  },
};
