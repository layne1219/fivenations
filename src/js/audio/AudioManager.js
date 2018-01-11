/* eslint class-methods-use-this: 0 */
import EventEmitter from '../sync/EventEmitter';
import { PreloadedSprites, Sprites } from './Sprites';
import { Events } from './Events';

const audioSprites = {};

let phaserGame;
let singleton;

/**
 * Manager class that is built around Phaser.Game Audio engine. It
 * is responsable to initialise the AudioSprites and register
 * event listeners for locally (not synced for multiplayer)
 * emitted events.
 */
class AudioManager {
  /**
   * Initialises Preloaded AudioSprites and registers event listeners
   */
  constructor() {
    this.initPreloadedAudioSprites();
    this.addEventListeners();
  }

  /**
   * Loads Preloaded AudioSprites from Phaser Asset cache
   * for further playback
   */
  initPreloadedAudioSprites() {
    PreloadedSprites.forEach(key => this.loadAudioSprite(key));
  }

  /**
   * Loads the AudioSprite and defines AudioFrames according
   * to the given marker definitions from Sprites.js
   */
  loadAudioSprite(key) {
    audioSprites[key] = phaserGame.add.audio(key);
    audioSprites[key].allowMultiple = true;
    Sprites[key].markers.forEach((marker) => {
      const data = Sprites[key].markers[marker];
      audioSprites[key].addMarker(
        marker,
        data.start,
        data.duration,
        data.volume,
        data.loop,
      );
    });
  }

  /**
   * Registers event listener predefined in Events.js
   */
  addEventListeners() {
    const dispatcher = EventEmitter.getInstance().local;
    Object.keys(Events).forEach((key) => {
      this.bindListener(dispatcher, key, Events[key]);
    });
  }

  /**
   * Links default or the given event listener to defined event
   * @param {object} emitter - EventDispatcher instance that shares
   * events across the complete game scope
   * @param {string} event - name of the event (e.g.: audio/test)
   * @param {object} options - details of event dispatching
   */
  bindListener(emitter, event, options) {
    const defaultCallback = () => this.playAudioSprite(options);
    const callback = options.callback || defaultCallback;
    emitter.addEventListeners(event, callback.bind(this));
  }

  /**
   * Triggers the audio frame to be played through Phaser.Game
   * Audio engine
   * @param {object} options - details of the playback
   */
  playAudioSprite(options) {
    const { key, marker } = options;
    if (!audioSprites[key]) return;
    audioSprites[key].play(marker);
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
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton) {
      singleton = new AudioManager();
    }
    return singleton;
  },
};
