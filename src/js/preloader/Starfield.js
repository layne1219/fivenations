export default {
    /**
     * Loading assets for the starfield object displaying the parallax background
     * @param {object} [preloader] Preloader object defined below
     * @return {void}
     */
    load: preloader =>  {
        preloader.load.image('starfield', 'assets/images/starfield/starfield.jpg');
        preloader.load.image('starfield.star.big-1', 'assets/images/starfield/star-s-1.png');
        preloader.load.image('starfield.star.big-2', 'assets/images/starfield/star-s-2.png');
        preloader.load.image('starfield.star.big-3', 'assets/images/starfield/star-s-3.png');
        preloader.load.image('starfield.star.small-1', 'assets/images/starfield/star-m-1.png');
        preloader.load.image('starfield.star.small-2', 'assets/images/starfield/star-m-2.png');
        preloader.load.image('starfield.star.small-3', 'assets/images/starfield/star-m-3.png');
        preloader.load.atlasJSONHash('starfield.clouds.bg.type-1', 'assets/images/starfield/background_clouds_type01.png', 'assets/images/starfield/background_clouds_type01.json');
        preloader.load.atlasJSONHash('starfield.clouds.bg.type-2', 'assets/images/starfield/background_clouds_type02.png', 'assets/images/starfield/background_clouds_type02.json');
        preloader.load.atlasJSONHash('starfield.planets.type-1', 'assets/images/starfield/background_planets01.png', 'assets/images/starfield/background_planets01.json');
        preloader.load.atlasJSONHash('starfield.planets.type-2', 'assets/images/starfield/background_planets02.png', 'assets/images/starfield/background_planets02.json');
        preloader.load.atlasJSONHash('starfield.meteorites', 'assets/images/starfield/background_meteorites.png', 'assets/images/starfield/background_meteorites.json');
    }
}
