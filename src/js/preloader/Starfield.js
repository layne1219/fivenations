const { PUBLIC_URL } = process.env;
const PATH_ASSETS = `${PUBLIC_URL}/assets/images`;

export default {
  /**
   * Loading assets for the starfield object displaying the parallax background
   * @param {object} [preloader] Preloader object defined below
   * @return {void}
   */
  load: (preloader) => {
    preloader.load.image('starfield', `${PATH_ASSETS}/starfield/starfield.png`);
    preloader.load.atlasJSONHash(
      'starfield.clouds.bg.type-1',
      `${PATH_ASSETS}/starfield/background_clouds_type01.png`,
      `${PATH_ASSETS}/starfield/background_clouds_type01.json`,
    );
    preloader.load.atlasJSONHash(
      'starfield.clouds.bg.type-2',
      `${PATH_ASSETS}/starfield/background_clouds_type02.png`,
      `${PATH_ASSETS}/starfield/background_clouds_type02.json`,
    );
    preloader.load.atlasJSONHash(
      'starfield.planets.type-1',
      `${PATH_ASSETS}/starfield/background_planets01.png`,
      `${PATH_ASSETS}/starfield/background_planets01.json`,
    );
    preloader.load.atlasJSONHash(
      'starfield.planets.type-2',
      `${PATH_ASSETS}/starfield/background_planets02.png`,
      `${PATH_ASSETS}/starfield/background_planets02.json`,
    );
    preloader.load.atlasJSONHash(
      'starfield.meteorites',
      `${PATH_ASSETS}/starfield/background_meteorites.png`,
      `${PATH_ASSETS}/starfield/background_meteorites.json`,
    );
  },
};
