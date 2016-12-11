define('WreckageManager', [
    'Graphics',
    'Wreckage',
    'DataObject'
], function(Graphics, Wreckage, DataObject) {

    var ns = window.fivenations;

    var phaserGame;
    var singleton;

    var wreckages = [];

    function WreckageManager() {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }
    }

    WreckageManager.prototype = {

        /**
         * Adds an wreckage object to the private collection
         * @param {object} config configuration object
         */
        add: function(config) {

            if (!config) {
                throw 'Invalid configuration object passed as a parameter!';
            }

            if (Object.keys(ns.wreckages).indexOf(config.id) === -1) {
                throw 'The requrested wreckage is not registered!';
            }

            var wreckage;
            var sprite = phaserGame.add.sprite(0, 0, config.id);
            var dataObject = new DataObject(phaserGame.cache.getJSON(config.id));

            // adding the freshly created wreckage to the main array
            var wreckage = new Wreckage({
                manager: this,
                sprite: sprite,
                dataObject: dataObject
            });

            // setting the coordinates if not ommitted 
            if (config.x || config.y) {
                sprite.x = config.x || 0;
                sprite.y = config.y || 0;
            }

            var group = Graphics.getInstance().getGroup('wreckages');
            group.add(sprite);

            wreckages.push(wreckage);
        },

        /**
         * Removes wreckage from the private collection
         * @param {object} wreckage Wreckage instance
         */
        remove: function(wreckage) {
            for (var i = wreckages.length - 1; i >= 0; i -= 1) {
                if (wreckage === wreckages[i]) {
                    wreckages.splice(i, 1);
                }
            }
            wreckage = null;
        },

        /**
         * destroys all the existing wreckages
         * @return {void}
         */
        reset: function() {
            wreckages = [];
        },

        /**
         * returns the Phaser.Game object for inconvinience 
         * @return {[object]} [Phaser.Game instnace]
         */
        getGame: function() {
            return phaserGame;
        }

    };

    return {

        /**
         * sets the global Phaser.Game instance
         * @param {void}
         */
        setGame: function(game) {
            phaserGame = game;
        },

        /**
         * returns singleton instance of the manager object
         * @return {object} Singleton instance of WreckageManager
         */
        getInstance: function() {
            if (!phaserGame) {
                throw 'Invoke setGame first to pass the Phaser Game entity!';
            }
            if (!singleton) {
                singleton = new WreckageManager();
            }
            return singleton;
        }

    };

});