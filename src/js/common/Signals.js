/* global Phaser, define */
define('Game.Signals', () => {
  function create() {
    const exports = {};

    exports.onResourcesUpdate = new Phaser.Signal();
    exports.onPlayerResourcesUpdate = new Phaser.Signal();

    return exports;
  }

  return {
    create,
  };
});
