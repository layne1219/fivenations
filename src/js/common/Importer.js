/* global document, FileReader */
/* eslint no-param-reassign: 0 */
let singleton;

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

  /**
   * Loads all the exported components and entities into the Game
   * @param {object} game - FiveNations Game Scene
   */
  loadMap(game) {
    const mapConfig = this.getMap();
    const players = this.getPlayers();

    game.map.new(mapConfig);
    game.entityManager.reset();

    Object.keys(players).forEach((id) => {
      const { user, active } = players[id];

      if (!active) return;

      game.eventEmitter.synced.players.add({
        authorised: !!user,
        ...players[id],
      });
    });

    this.getEntities().forEach((config) => {
      game.eventEmitter.synced.entities.add(config);
    });

    this.getSpaceObjects().forEach((config) => {
      game.map
        .getStarfield()
        .getDeepSpaceLayer()
        .add(config);
    });
  }
}

export default Importer;
