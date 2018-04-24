import Player from './Player';
import { PLAYER_MANAGER_COLORS } from '../common/Const';

let players = [];

const singleton = {
  /**
   * Resets the collection of active players
   * @return {void}
   */
  reset() {
    players = [];
  },

  /**
   * adds a new player to the collective according to the given configurations
   * @param {object} config Configuration object
   * @return {void}
   */
  addPlayer(config) {
    if (!config) {
      throw new Error('Invalid configuration for constructing a Player instance!');
    }
    players.push(new Player(config));
  },

  /**
   * returns an array of the registered players
   * @return {array}
   */
  getPlayers() {
    return players;
  },

  /**
   * returns the player that is controlled by the current user
   * @return {object} Player instance
   */
  getUser() {
    if (!this.user) {
      for (let i = players.length - 1; i >= 0; i -= 1) {
        if (players[i].isControlledByUser()) {
          this.user = players[i];
          return;
        }
      }
      // we return a fake object that exposes the isAuthorised function
      this.user = {
        isAuthorised: () => false,
      };
    }
    return this.user;
  },

  /**
   * returns a player by the given guid
   * @return {object} Player instance
   */
  getPlayerByGUID(guid) {
    if (!guid) throw new Error('First parameter must be a valid guid!');
    for (let i = players.length - 1; i >= 0; i -= 1) {
      if (players[i].getGUID() === guid) {
        return players[i];
      }
    }
    return null;
  },

  /**
   * returns a player by the given team number
   * @return {object} Player instance
   */
  getPlayerByTeam(team) {
    if (!team) throw new Error('First parameter must be a valid Team Id!');
    for (let i = players.length - 1; i >= 0; i -= 1) {
      if (players[i].getTeam() === team) {
        return players[i];
      }
    }
    return null;
  },

  /**
   * returns the number of active players
   * @return {integer}
   */
  getPlayersNumber() {
    return players.length;
  },

  /**
   * Returns the collection of color codes for players
   * @return {array}
   */
  getColors() {
    return PLAYER_MANAGER_COLORS;
  },

  /**
   * Returns whether the given players are hostile to each other
   * @param {object} Player instance
   * @param {boject} Player instance
   * @return {boolean}
   */
  isPlayerHostileToPlayer(a, b) {
    if (a.isIndependent() || b.isIndependent()) return false;
    return a.getTeam() !== b.getTeam();
  },

  /**
   * Returns whether the given players are hostile to each other
   * @param {object} Entity instance
   * @param {object} Player instance
   * @return {boolean}
   */
  isEntityHostileToPlayer(entity, player) {
    return this.isPlayerHostileToPlayer(player, entity.getPlayer());
  },

  /**
   * Returns whether the user is authorised or not
   * @return {boolean}
   */
  isUserAuthorised() {
    if (undefined === this.authorised) {
      this.authorised = this.getUser().isAuthorised();
    }
    return this.authorised;
  },
};

export default {
  /**
   * Returns singleton instance of PlayerManager
   * @param  {boolean} reset
   * @return {object}
   */
  getInstance(reset) {
    if (reset) singleton.reset();
    return singleton;
  },
};
