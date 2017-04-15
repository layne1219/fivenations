import Util from '../common/Util';

let dispatcher;
let cursors;
let phaserGame;
let singleton;

function UserKeyboard() {
    init.call(this);
    registerEventListeners.call(this);
}

function init() {
    dispatcher = new Util.EventDispatcher();
    // handling the curser key events
    cursors = phaserGame.input.keyboard.createCursorKeys();
}

function registerEventListeners() {

    // Delete
    var keyDelete = phaserGame.input.keyboard.addKey(Phaser.Keyboard.DELETE);
    keyDelete.onDown.add(function(){ dispatcher.dispatch('key/delete'); });

}

function listenToCursorKeys() {
    if (cursors.up.isDown) {
        dispatcher.dispatch('cursor/up');
    } else if (cursors.down.isDown) {
        dispatcher.dispatch('cursor/down');
    }

    if (cursors.left.isDown) {
        dispatcher.dispatch('cursor/left');
    } else if (cursors.right.isDown) {
        dispatcher.dispatch('cursor/right');
    }
}

UserKeyboard.prototype = {

    on: function(event, callback) {
        dispatcher.addEventListener(event, callback);
        return this;
    },

    isDown: function(keyCode) {
        return phaserGame.input.keyboard.isDown(keyCode);
    },

    update: function() {
        listenToCursorKeys();
    }
};

export default {

    setGame: function(game) {
        phaserGame = game;
    },

    getInstance: function() {
        if (!phaserGame) {
            throw 'Invoke setGame first to pass the Phaser Game entity!';
        }
        if (!singleton) {
            singleton = new UserKeyboard();
        }
        return singleton;
    }

};
