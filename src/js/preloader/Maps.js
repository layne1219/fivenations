const { PUBLIC_URL } = process.env;
// default maps to be preloaded regardless of the game mode
const DEFAULT_MAPS = ['promotionalmap01-1', 'wnconf', 'wnconf2'];

export default {
  /**
   * Loads all available translation files
   * @param {object} preloader - Phaser Preloader object
   */
  load(preloader) {
    DEFAULT_MAPS.forEach((key) => {
      preloader.load.json(key, `${PUBLIC_URL}/assets/maps/${key}.json`);
    });
  },
};
