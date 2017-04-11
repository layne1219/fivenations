define('Game.Signals', function() {

    function create() {
        var exports = {};

        exports.onResourcesUpdate = new Phaser.Signal();
        exports.onPlayerResourcesUpdate = new Phaser.Signal();

        return exports;
    }

    return {
        create: create
    };

});