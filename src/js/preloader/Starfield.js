const { PUBLIC_URL } = process.env;
const PATH_ASSETS_DATA = `${PUBLIC_URL}/assets/datas/starfield/`;
const PATH_ASSETS = `${PUBLIC_URL}/assets/images`;

export default {
  /**
   * Loading assets for the starfield object displaying the parallax background
   * @param {object} [preloader] Preloader object defined below
   * @return {void}
   */
  load: (preloader) => {
    preloader.load.image(
      'starfield-1',
      `${PATH_ASSETS}/starfield/starfield-1.png`,
    );

    preloader.load.image(
      'starfield-2',
      `${PATH_ASSETS}/starfield/starfield-2.png`,
    );

    preloader.load.image(
      'starfield-3',
      `${PATH_ASSETS}/starfield/starfield-3.png`,
    );

    preloader.load.image(
      'starfield-4',
      `${PATH_ASSETS}/starfield/starfield-4.png`,
    );

    preloader.load.image(
      'starfield-5',
      `${PATH_ASSETS}/starfield/starfield-5.png`,
    );

    preloader.load.image(
      'starfield-6',
      `${PATH_ASSETS}/starfield/starfield-6.png`,
    );

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
    preloader.load.atlasJSONHash(
      'starfield.smallplanets.type-1',
      `${PATH_ASSETS}/starfield/background_small_planets01.png`,
      `${PATH_ASSETS}/starfield/background_small_planets01.json`,
    );

    preloader.load.image(
      'starfield.galaxy.type-1',
      `${PATH_ASSETS}/starfield/bg_galaxy01.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-2',
      `${PATH_ASSETS}/starfield/bg_galaxy02.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-3',
      `${PATH_ASSETS}/starfield/bg_galaxy03.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-4',
      `${PATH_ASSETS}/starfield/bg_galaxy04.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-5',
      `${PATH_ASSETS}/starfield/bg_galaxy05.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-6',
      `${PATH_ASSETS}/starfield/bg_galaxy06.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-7',
      `${PATH_ASSETS}/starfield/bg_galaxy07.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-8',
      `${PATH_ASSETS}/starfield/bg_galaxy08.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-9',
      `${PATH_ASSETS}/starfield/bg_galaxy09.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-10',
      `${PATH_ASSETS}/starfield/bg_galaxy10.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-11',
      `${PATH_ASSETS}/starfield/bg_galaxy11.png`,
    );
    preloader.load.image(
      'starfield.galaxy.type-12',
      `${PATH_ASSETS}/starfield/bg_galaxy12.png`,
    );

    preloader.load.atlasJSONHash(
      'starfield.foregound.foreground.type-1',
      `${PATH_ASSETS}/starfield/foreground_clouds_type01.png`,
      `${PATH_ASSETS}/starfield/foreground_clouds_type01.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.foregound.foreground.type-2',
      `${PATH_ASSETS}/starfield/foreground_clouds_type02.png`,
      `${PATH_ASSETS}/starfield/foreground_clouds_type02.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.smallmeteorites.type-1',
      `${PATH_ASSETS}/starfield/small_background_meteorites01.png`,
      `${PATH_ASSETS}/starfield/small_background_meteorites01.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.smallmeteorites.type-2',
      `${PATH_ASSETS}/starfield/small_background_meteorites02.png`,
      `${PATH_ASSETS}/starfield/small_background_meteorites02.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.smallmeteorites.type-3',
      `${PATH_ASSETS}/starfield/small_background_meteorites03.png`,
      `${PATH_ASSETS}/starfield/small_background_meteorites03.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.shootingstart',
      `${PATH_ASSETS}/starfield/background_shootingstar.png`,
      `${PATH_ASSETS}/starfield/background_shootingstar.json`,
    );
  },
};
