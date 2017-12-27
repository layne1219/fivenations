/* global window */
const ns = window.fivenations;
const { PUBLIC_URL } = process.env;
const PATH_ASSETS_DATA_UNITS = `${PUBLIC_URL}/assets/datas/units`;
const PATH_ASSETS_IMG_UNITS = `${PUBLIC_URL}/assets/images/units`;

const NO_WRECKAGES_PER_NATION = 5;

// const like object to describe all the wreckages participating in the gameplay
ns.effects = ns.effects || {};

['fed', 'ath', 'syl', 'tho'].forEach((nation) => {
  for (let i = 1; i <= NO_WRECKAGES_PER_NATION; i += 1) {
    ns.effects[`${nation}-wreck-${i}`] = {
      preloading: true,
      spriteURL: `${PATH_ASSETS_IMG_UNITS}/${nation}/${nation}_wreck0${i}.png`,
      atlasURL: `${PATH_ASSETS_IMG_UNITS}/${nation}/${nation}_wreck0${i}.json`,
      dataURL: `${PATH_ASSETS_DATA_UNITS}/${nation}/${nation}-wreck-${i}.json`,
    };
  }
});

export default {
  /**
   * Loads all the correspondant resources for the wreckages listed in the private
   * wreckages object
   * @param {object} [preloader] Preloader object defined below
   * @return {void}
   */
  load(preloader) {
    Object.keys(ns.effects).forEach((key) => {
      if (!ns.effects[key].preloading) {
        return;
      }

      preloader.load.atlasJSONHash(
        key,
        ns.effects[key].spriteURL,
        ns.effects[key].atlasURL,
      );
      preloader.load.json(key, ns.effects[key].dataURL);
    }, preloader);
  },
};
