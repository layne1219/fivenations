const { PUBLIC_URL } = process.env;
const PATH_ASSETS = `${PUBLIC_URL}/assets/images`;

export default {
  /**
   * Loading assets for the starfield object displaying the parallax background
   * @param {object} [preloader] Preloader object defined below
   * @return {void}
   */
  load: (preloader) => {
    preloader.load.image(
      'menu-background-1',
      `${PATH_ASSETS}/menu/menu_backgrounds/mainmenu_background.jpg`,
    );

    preloader.load.atlasJSONHash(
      'mainmenu-elements',
      `${PATH_ASSETS}/menu/mainmenu_element.png`,
      `${PATH_ASSETS}/menu/mainmenu_element.json`,
    );
  },
};
