import 'phaser-shim';
import './globals';
import Boot from './scenes/Boot';
import Preloader from './scenes/Preloader';
import Menu from './scenes/Menu';
import Game from './scenes/Game';

const ns = window.fivenations;

const DEFAULT_CANVAS_WIDTH = 1024;
const DEFAULT_CANVAS_HEIGHT = 768;

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
    game = new Phaser.Game(width || DEFAULT_CANVAS_WIDTH, height || DEFAULT_CANVAS_HEIGHT, Phaser.AUTO, canvasElmId);
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
