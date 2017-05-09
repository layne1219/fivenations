import Player from './Player';

var colors = [
    '0x08A2EA',
    '0x10B308',
    '0xF28209',
    '0xBA10D9',
    '0xD40F0F',
    '0xF8F8F9',
    '0xE5C410',
    '0x65615D'
];

var players = [];

var singleton = {

    /**
     * Resets the collection of active players 
     * @return {void}
     */
    reset: function() {
        players = [];
    },

    /**
     * adds a new player to the collective according to the given configurations
     * @param {object} config Configuration object 
     * @return {void}
     */
    addPlayer: function(config) {
        if (!config) throw 'Invalid configuration for constructing a Player instance!';
        players.push(new Player(config));
    },

    /**
     * returns an array of the registered players 
     * @return {array}
     */
    getPlayers: function() {
        return players;
    },

    /**
     * returns the player that is controlled by the current user
     * @return {object} Player instance
     */
    getUser: function() {
        for (var i = players.length - 1; i >= 0; i -= 1) {
            if (players[i].isControlledByUser()) {
                return players[i];
            }
        }
        return false;
    },

    /**
     * returns a player by the given guid
     * @return {object} Player instance
     */
    getPlayerByGUID: function(guid) {
        if (!guid) throw 'First parameter must be a valid guid!';
        for (var i = players.length - 1; i >= 0; i -= 1) {
            if (players[i].getGUID() === guid) {
                return players[i];
            }
        }
    },

    /**
     * returns a player by the given team number
     * @return {object} Player instance
     */
    getPlayerByTeam: function(team) {
        if (!team) throw 'First parameter must be a valid Team Id!';
        for (var i = players.length - 1; i >= 0; i -= 1) {
            if (players[i].getTeam() === team) {
                return players[i];
            }
        }
    },                    

    /**
     * returns the number of active players
     * @return {integer}
     */
    getPlayersNumber: function() {
        return players.length;
    },

    /**
     * Returns the collection of color codes for players
     * @return {array}
     */
    getColors: function() {
        return colors;
    },

    /**
     * Returns whether the given players are hostile to each other
     * @param {object} Player instance
     * @param {boject} Player instance
     * @return {boolean}
     */
    isPlayerHostileToPlayer: function(a, b) {
        return a.getTeam() !== b.getTeam();
    },
    
    /**
     * Returns whether the given players are hostile to each other
     * @param {object} Entity instance
     * @param {boject} Player instance
     * @return {boolean}
     */
    isEntityHostileToPlayer: function(entity, player) {
        return this.isPlayerHostileToPlayer(player, entity.getPlayer())
    }

};

export default {

    /**
     * Returns singleton instance of PlayerManager
     * @param  {boolean} reset
     * @return {object}
     */
    getInstance: function(reset) {
        if (reset) singleton.reset();
        return singleton;
    }

};
