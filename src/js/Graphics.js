define('Graphics', function() {

    var phaserGame,
        singleton;

    function createGraphicsInstance() {

        var groups = {},
            // layers ordered as follows
            groupNames = [
                'starfield',
                'selectors-buildings',
                'entities-buildings',
                'selectors',
                'entities',
                'prior-gui-elements'
            ];

        groupNames.forEach(function(name) {
            groups[name] = phaserGame.add.group();
        });

        return {

            getGroup: function(id) {
                if (!id) {
                    throw 'Invalid Id to retrieve a group!';
                }
                if (!groups[id]) {
                    throw 'The group cannot be identified through the passed id!';
                }
                return groups[id];
            }

        };

    }

    return {

        setGame: function(game) {
            phaserGame = game;
        },

        /**
         * Accessing the singleton instance of the GUI 
         * @return {object} GUI
         */
        getInstance: function() {
            if (!phaserGame) {
                throw 'Invoke setGame first to pass the Phaser Game entity!';
            }
            if (!singleton) {
                singleton = createGraphicsInstance();
            }
            return singleton;
        }

    };

});