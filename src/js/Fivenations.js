import 'phaser';
import Boot from './scenes/Boot';
import Preloader from './scenes/Preloader';
import Menu from './scenes/Menu';
import Game from './scenes/Game';

const DEFAULT_CANVAS_WIDTH = 1024;
const DEFAULT_CANVAS_HEIGHT = 768;

const ns = window.fivenations = window.fivenations || {};

// Shared 
ns.gui = ns.gui || {};

// Cache for assets are not required to be loaded more than once
ns.cache = {};

let game;

function exposeGameAttributes(params) {
    const { width, height, canvasElmId } = params;
    ns.window = {
        width: width || DEFAULT_CANVAS_WIDTH,
        height: height || DEFAULT_CANVAS_HEIGHT,
        canvasElmId
    };
}

function initPhaserGame(params) {
    const { width, height, canvasElmId } = params;
    game = new Phaser.Game(width, height, Phaser.AUTO, canvasElmId);
    game.state.add('boot', Boot);
    game.state.add('preloader', Preloader);
    game.state.add('menu', Menu);
    game.state.add('game', Game);
}

export default class App {

    constructor(params) {
        exposeGameAttributes(params);
        initPhaserGame(params);
    }

    start() {
        game.state.start('boot');
    }

}
