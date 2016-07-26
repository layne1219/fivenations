define('PlayerManager', ['Player'], function(Player) {

    var
        colors = [
            '0x08A2EA',
            '0x10B308',
            '0xF28209',
            '0xBA10D9',
            '0xD40F0F',
            '0xF8F8F9',
            '0xE5C410',
            '0x65615D'
        ],

        players = [],

        singleton = {

            addPlayer: function(config) {
                if (!config) throw 'Invalid configuration for constructing a Player instance!';
                players.push(new Player(config));
            },

            getPlayers: function() {
                return players;
            },

            getUser: function() {
                for (var i = players.length - 1; i >= 0; i -= 1) {
                    if (players[i].isControlledByUser()) {
                        return players[i];
                    }
                }
                return false;
            },

            getPlayerByGUID: function(guid) {
                if (!guid) throw 'First parameter must be a valid guid!';
                for (var i = players.length - 1; i >= 0; i -= 1) {
                    if (players[i].getGUID() === guid) {
                        return players[i];
                    }
                }
            },            

            getPlayersNumber: function() {
                return players.length;
            },

            getColors: function() {
                return colors;
            }

        };

    return {

        getInstance: function() {
            return singleton;
        }

    };

});