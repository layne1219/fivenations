let phaserGame;
let singleton;

class AudioManager {
  constructor(game) {
    this.game = game;
  }

  addEventListeners(emitter) {
    // emitter.addEventListeners('');
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
