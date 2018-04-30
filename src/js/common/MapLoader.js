/* global document, FileReader */

/**
 * Function to open the file system selector window and
 * fetch the data from the selected json file
 * @return {Promise}
 */
function loadJSON() {
  return new Promise((resolve, rejected) => {
    const elm = document.getElementById('selectFile');
    elm.click();
    elm.onchange = function onchange(event) {
      const targetFile = event.target.files[0];
      if (!targetFile) {
        rejected();
      }
      const reader = new FileReader();
      reader.onload = function onload(e) {
        const result = JSON.parse(e.target.result);
        resolve(result);
      };
      reader.readAsText(targetFile);
    };
  });
}

/**
 * Helper class to load all the various informations about the map
 */
class Importer {
  /**
   * @param {object} json - exported json through Map Editor
   */
  constructor(json) {
    this.import(json);
  }

  /**
   * Returns the map configurations
   */
  getMap() {
    return this.map;
  }

  /**
   * Returns all the space objects
   */
  getSpaceObjects() {
    return this.spaceObjects || [];
  }

  /**
   * Returns all the entities
   */
  getEntities() {
    return this.entities || [];
  }

  /**
   * Returns all the players
   */
  getPlayers() {
    return this.players || {};
  }

  /**
   * Sets the inner state from the selected json
   * @param {object} json - exported json through Map Editor
   */
  import(json) {
    Object.keys(json).forEach((key) => {
      this[key] = json[key];
    });
  }
}

/**
 * Singleton pattern around the main class to make it useble across
 * the whole application
 */
export default {
  /**
   * Loads all the exported components and entities into the Game
   * @param {object} game - FiveNations Game Scene
   */
  load(game, json) {
    const importer = new Importer(json);
    const mapConfig = importer.getMap();
    const players = importer.getPlayers();

    game.entityManager.reset();
    game.playerManager.reset();

    game.map.new(mapConfig);

    Object.keys(players)
      .map(id => players[id])
      .sort(a => (a.user ? -1 : 1))
      .forEach((player) => {
        const { user, active } = player;

        if (!active) return;

        // creates the player event
        game.eventEmitter.synced.players
          .add({
            authorised: !!user,
            ...player,
          })
          .then((guid) => {
            game.eventEmitter.synced.players(guid).alter({
              titanium: 0,
              silicium: 0,
              energy: 0,
              uranium: 0,
            });
          });
      });

    importer.getEntities().forEach((config) => {
      game.eventEmitter.synced.entities.add(config);
    });

    importer.getSpaceObjects().forEach((config) => {
      game.map
        .getStarfield()
        .getDeepSpaceLayer()
        .add(config);
    });
  },
};

export { loadJSON };
