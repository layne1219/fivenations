const PUBLIC_URL = process.env.PUBLIC_URL;
const PATH_ASSETS = `${PUBLIC_URL}/assets/images`;

function Boot() {}

Boot.prototype = {
    preload: function() {
        this.load.crossOrigin = 'anonymous';
        this.load.image('preloader', `${PATH_ASSETS}/preloader.gif`);
    },

    create: function() {

        // preventing the context menu to appear when the user clicks with the right mouse button
        this.game.canvas.oncontextmenu = function(e) {
            e.preventDefault();
        };

        // configure game
        this.game.input.maxPointers = 1;

        if (this.game.device.desktop) {
            this.game.scale.pageAlignHorizontally = true;
        } else {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.minWidth = 480;
            this.game.scale.minHeight = 260;
            this.game.scale.maxWidth = 640;
            this.game.scale.maxHeight = 480;
            this.game.scale.forceOrientation(true);
            this.game.scale.pageAlignHorizontally = true;
        }
        this.game.state.start('preloader');
    }
};

export default Boot;
