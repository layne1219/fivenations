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

    preloader.load.json('cloud1a', `${PATH_ASSETS_DATA}/cloud1a.json`);
    preloader.load.json('cloud1b', `${PATH_ASSETS_DATA}/cloud1b.json`);
    preloader.load.json('cloud1c', `${PATH_ASSETS_DATA}/cloud1c.json`);
    preloader.load.json('cloud1d', `${PATH_ASSETS_DATA}/cloud1d.json`);

    preloader.load.atlasJSONHash(
      'starfield.clouds.bg.type-2',
      `${PATH_ASSETS}/starfield/background_clouds_type02.png`,
      `${PATH_ASSETS}/starfield/background_clouds_type02.json`,
    );

    preloader.load.json('cloud2a', `${PATH_ASSETS_DATA}/cloud2a.json`);
    preloader.load.json('cloud2b', `${PATH_ASSETS_DATA}/cloud2b.json`);
    preloader.load.json('cloud2c', `${PATH_ASSETS_DATA}/cloud2c.json`);
    preloader.load.json('cloud2d', `${PATH_ASSETS_DATA}/cloud2d.json`);

    preloader.load.atlasJSONHash(
      'starfield.planets.type-1',
      `${PATH_ASSETS}/starfield/background_planets01.png`,
      `${PATH_ASSETS}/starfield/background_planets01.json`,
    );

    preloader.load.json('planet1', `${PATH_ASSETS_DATA}/planet1.json`);
    preloader.load.json('planet2', `${PATH_ASSETS_DATA}/planet2.json`);
    preloader.load.json('planet3', `${PATH_ASSETS_DATA}/planet3.json`);
    preloader.load.json('planet4', `${PATH_ASSETS_DATA}/planet4.json`);
    preloader.load.json('planet5', `${PATH_ASSETS_DATA}/planet5.json`);
    preloader.load.json('planet6', `${PATH_ASSETS_DATA}/planet6.json`);
    preloader.load.json('planet7', `${PATH_ASSETS_DATA}/planet7.json`);
    preloader.load.json('planet8', `${PATH_ASSETS_DATA}/planet8.json`);
    preloader.load.json('planet9', `${PATH_ASSETS_DATA}/planet9.json`);
    preloader.load.json('planet10', `${PATH_ASSETS_DATA}/planet10.json`);

    preloader.load.atlasJSONHash(
      'starfield.planets.type-2',
      `${PATH_ASSETS}/starfield/background_planets02.png`,
      `${PATH_ASSETS}/starfield/background_planets02.json`,
    );

    preloader.load.json('planet11', `${PATH_ASSETS_DATA}/planet11.json`);
    preloader.load.json('planet12', `${PATH_ASSETS_DATA}/planet12.json`);
    preloader.load.json('planet13', `${PATH_ASSETS_DATA}/planet13.json`);
    preloader.load.json('planet14', `${PATH_ASSETS_DATA}/planet14.json`);
    preloader.load.json('planet15', `${PATH_ASSETS_DATA}/planet15.json`);
    preloader.load.json('planet16', `${PATH_ASSETS_DATA}/planet16.json`);
    preloader.load.json('planet17', `${PATH_ASSETS_DATA}/planet17.json`);
    preloader.load.json('planet18', `${PATH_ASSETS_DATA}/planet18.json`);
    preloader.load.json('planet19', `${PATH_ASSETS_DATA}/planet19.json`);
    preloader.load.json('planet20', `${PATH_ASSETS_DATA}/planet20.json`);

    preloader.load.atlasJSONHash(
      'starfield.meteorites',
      `${PATH_ASSETS}/starfield/background_meteorites.png`,
      `${PATH_ASSETS}/starfield/background_meteorites.json`,
    );

    preloader.load.json('meteorites1', `${PATH_ASSETS_DATA}/meteorites1.json`);
    preloader.load.json('meteorites2', `${PATH_ASSETS_DATA}/meteorites2.json`);
    preloader.load.json('meteorites3', `${PATH_ASSETS_DATA}/meteorites3.json`);
    preloader.load.json('meteorites4', `${PATH_ASSETS_DATA}/meteorites4.json`);
    preloader.load.json('meteorites5', `${PATH_ASSETS_DATA}/meteorites5.json`);
    preloader.load.json('meteorites6', `${PATH_ASSETS_DATA}/meteorites6.json`);
    preloader.load.json('meteorites7', `${PATH_ASSETS_DATA}/meteorites7.json`);
    preloader.load.json('meteorites8', `${PATH_ASSETS_DATA}/meteorites8.json`);
    preloader.load.json('meteorites9', `${PATH_ASSETS_DATA}/meteorites9.json`);

    preloader.load.atlasJSONHash(
      'starfield.smallplanets.type-1',
      `${PATH_ASSETS}/starfield/background_small_planets01.png`,
      `${PATH_ASSETS}/starfield/background_small_planets01.json`,
    );

    preloader.load.json(
      'smallplanet1',
      `${PATH_ASSETS_DATA}/smallplanet1.json`,
    );
    preloader.load.json(
      'smallplanet2',
      `${PATH_ASSETS_DATA}/smallplanet2.json`,
    );
    preloader.load.json(
      'smallplanet3',
      `${PATH_ASSETS_DATA}/smallplanet3.json`,
    );
    preloader.load.json(
      'smallplanet4',
      `${PATH_ASSETS_DATA}/smallplanet4.json`,
    );

    preloader.load.image(
      'starfield.galaxy.type-1',
      `${PATH_ASSETS}/starfield/bg_galaxy01.png`,
    );
    preloader.load.json('galaxy1', `${PATH_ASSETS_DATA}/galaxy1.json`);

    preloader.load.image(
      'starfield.galaxy.type-2',
      `${PATH_ASSETS}/starfield/bg_galaxy02.png`,
    );
    preloader.load.json('galaxy2', `${PATH_ASSETS_DATA}/galaxy2.json`);

    preloader.load.image(
      'starfield.galaxy.type-3',
      `${PATH_ASSETS}/starfield/bg_galaxy03.png`,
    );
    preloader.load.json('galaxy3', `${PATH_ASSETS_DATA}/galaxy3.json`);

    preloader.load.image(
      'starfield.galaxy.type-4',
      `${PATH_ASSETS}/starfield/bg_galaxy04.png`,
    );
    preloader.load.json('galaxy4', `${PATH_ASSETS_DATA}/galaxy4.json`);

    preloader.load.image(
      'starfield.galaxy.type-5',
      `${PATH_ASSETS}/starfield/bg_galaxy05.png`,
    );
    preloader.load.json('galaxy5', `${PATH_ASSETS_DATA}/galaxy5.json`);

    preloader.load.image(
      'starfield.galaxy.type-6',
      `${PATH_ASSETS}/starfield/bg_galaxy06.png`,
    );
    preloader.load.json('galaxy6', `${PATH_ASSETS_DATA}/galaxy6.json`);

    preloader.load.image(
      'starfield.galaxy.type-7',
      `${PATH_ASSETS}/starfield/bg_galaxy07.png`,
    );
    preloader.load.json('galaxy7', `${PATH_ASSETS_DATA}/galaxy7.json`);

    preloader.load.image(
      'starfield.galaxy.type-8',
      `${PATH_ASSETS}/starfield/bg_galaxy08.png`,
    );
    preloader.load.json('galaxy8', `${PATH_ASSETS_DATA}/galaxy8.json`);

    preloader.load.image(
      'starfield.galaxy.type-9',
      `${PATH_ASSETS}/starfield/bg_galaxy09.png`,
    );
    preloader.load.json('galaxy9', `${PATH_ASSETS_DATA}/galaxy9.json`);

    preloader.load.image(
      'starfield.galaxy.type-10',
      `${PATH_ASSETS}/starfield/bg_galaxy10.png`,
    );
    preloader.load.json('galaxy10', `${PATH_ASSETS_DATA}/galaxy10.json`);

    preloader.load.image(
      'starfield.galaxy.type-11',
      `${PATH_ASSETS}/starfield/bg_galaxy11.png`,
    );
    preloader.load.json('galaxy11', `${PATH_ASSETS_DATA}/galaxy11.json`);

    preloader.load.image(
      'starfield.galaxy.type-12',
      `${PATH_ASSETS}/starfield/bg_galaxy12.png`,
    );
    preloader.load.json('galaxy12', `${PATH_ASSETS_DATA}/galaxy12.json`);

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
    preloader.load.json(
      'smallmeteorites1',
      `${PATH_ASSETS_DATA}/smallmeteorites1.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.smallmeteorites.type-2',
      `${PATH_ASSETS}/starfield/small_background_meteorites02.png`,
      `${PATH_ASSETS}/starfield/small_background_meteorites02.json`,
    );
    preloader.load.json(
      'smallmeteorites2',
      `${PATH_ASSETS_DATA}/smallmeteorites2.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.smallmeteorites.type-3',
      `${PATH_ASSETS}/starfield/small_background_meteorites03.png`,
      `${PATH_ASSETS}/starfield/small_background_meteorites03.json`,
    );
    preloader.load.json(
      'smallmeteorites3',
      `${PATH_ASSETS_DATA}/smallmeteorites3.json`,
    );

    preloader.load.atlasJSONHash(
      'starfield.shootingstar',
      `${PATH_ASSETS}/starfield/background_shootingstar.png`,
      `${PATH_ASSETS}/starfield/background_shootingstar.json`,
    );
    preloader.load.json(
      'shootingstar',
      `${PATH_ASSETS_DATA}/shootingstar.json`,
    );
  },
};
