let phaserGame;
let singleton;

function createGraphicsInstance() {
  const groups = {};
  // layers ordered as follows
  const groupNames = [
    'starfield',
    'color-indicators',
    'selectors-buildings',
    'entities-buildings',
    'energy-shields-buildings',
    'selectors',
    'projectiles',
    'entities',
    'energy-shields',
    'effects',
    'prior-gui-elements',
    'starfield-foreground',
    'fogofwar',
    'gui',
    'tooltips',
  ];

  groupNames.forEach((name) => {
    groups[name] = phaserGame.add.group();
  });

  return {
    getGroup(id) {
      if (!id) {
        throw new Error('Invalid Id to retrieve a group!');
      }
      if (!groups[id]) {
        throw new Error('The group cannot be identified through the passed id!');
      }
      return groups[id];
    },
  };
}

export default {
  setGame(game) {
    phaserGame = game;
  },

  /**
   * Accessing the singleton instance of the GUI
   * @param {boolean} forceNewInstance
   * @return {object} GUI
   */
  getInstance(forceNewInstance) {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton || forceNewInstance) {
      singleton = createGraphicsInstance();
    }
    return singleton;
  },
};
