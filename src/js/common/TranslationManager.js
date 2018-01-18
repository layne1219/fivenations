/* global navigator */
/* eslint class-methods-use-this: 0 */
import { SUPPORTED_LOCALES, DEFAUT_LOCALE } from './Const';

let currentLocale;
let phaserGame;
let singleton;

/**
 * Manager class that is responsable to fetch translation fragments
 * according to the current locale defined by the browser's settings
 */
class TranslationManager {
  /**
   * Loads all translations and sets the locale
   */
  constructor() {
    this.loadLanguageFragments();
    this.initLocale();
  }

  /**
   * Loads all translation fragments from Preloder cache
   */
  loadLanguageFragments() {
    this.fragments = {};
    SUPPORTED_LOCALES.forEach((locale) => {
      this.fragments[locale] = phaserGame.cache.getJSON(locale);
    });
  }

  /**
   * Fetches the current locale from the browser settings. If it
   * cannot be found in the supported locales collection it automatically
   * falls back to the default locale
   */
  initLocale() {
    currentLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
    if (SUPPORTED_LOCALES.every(v => currentLocale !== v)) {
      currentLocale = DEFAUT_LOCALE;
    }
  }

  /**
   * Resolves the given ID to the translation based on the current locale
   * @param {string} key - the ID of the given translation
   * @return {string} the translated string of the given ID
   */
  translate(key) {
    if (!key) return '';
    return this.fragments[currentLocale][key] || key;
  }

  /**
   * Returns the current locale code such as 'en_US' or 'en_GB'
   * @return {string} locale
   */
  getLocale() {
    return currentLocale;
  }
}

export default {
  /**
   * sets the global Phaser.Game instance
   * @param {void}
   */
  setGame(game) {
    phaserGame = game;
  },

  /**
   * returns singleton instance of the manager object
   * @return {object} Singleton instance of EntityManager
   */
  getInstance() {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass required Phaser.Game instance!');
    }
    if (!singleton) {
      singleton = new TranslationManager();
    }
    return singleton;
  },
};
