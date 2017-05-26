const ns = window.fivenations;
const MINIMIZED_WIDTH = 160;
const MINIMIZED_HEIGHT = 160;

export default class Minimap {

    /**
     * Creats a Minimap instance
     * @param {[object]} phaserGame     [reference to a Game instance]
     * @param {[object]} map()          [reference to a Map instance]
     * @param {[object]} entityManager  [reference to EntityManager]
     * @param {[object]} UserPointer    [reference to UserPointer]
     */
    constructor({ phaserGame, map, entityManager, userPointer, playerManager }) {

        this.phaserGame = phaserGame;
        this.userPointer = userPointer;
        this.playerManager = playerManager;

        // Create a graphics object to display the desired elements
        this.graphics = phaserGame.add.graphics(0, 0);

        // referencies to local variables 
        this.map = map;
        this.entityManager = entityManager;

        // calculating the ratio
        this.ratio = {
            x: MINIMIZED_WIDTH / this.map.getScreenWidth(),
            y: MINIMIZED_HEIGHT / this.map.getScreenHeight()
        };

    }

    setEventListeners() {
        this.setLeftButtonListeners();
        this.setRightButtonListeners();
    }

    setLeftButtonListeners() {
        // making the minimap area clickable 
        this.userPointer.on('leftbutton/move', function(userPointer) {

            const coords = this.getMouseCoords(userPointer, this.map, this.panel, this.graphics, true);

            // if getMouseCoords returns with false then the coordinates are not legit
            if (!coords) {
                return;
            }

            this.map.scrollTo(coords.x, coords.y);

        }.bind(this));
    }

    setRightButtonListeners() {
        // making the minimap area clickable 
        this.userPointer.on('rightbutton/down', function(userPointer) {

            const coords = this.getMouseCoords(userPointer, this.map, this.panel, this.graphics);

            // if getMouseCoords returns with false then the coordinates are not legit
            if (!coords) {
                return;
            }

            this.entityManager
                .entities(':user:selected')
                .reset()
                .move({
                    x: coords.x,
                    y: coords.y
                });

        }.bind(this));
    }

    getMouseCoords(userPointer, map, panel, graphics, alignToCentre) {
        const mapWidth = map.getScreenWidth();
        const mapHeight = map.getScreenHeight();
        let ratioX = ns.window.width / mapWidth;
        let ratioY = ns.window.height / mapHeight;
        let width = MINIMIZED_WIDTH * ratioX;
        let height = MINIMIZED_HEIGHT * ratioY;
        let mouseCoords = userPointer.getRealCoords();
        let mouseX = mouseCoords.x - panel.x - graphics.x;
        let mouseY = mouseCoords.y - panel.y - graphics.y;

        if (mouseX > MINIMIZED_WIDTH || mouseY > MINIMIZED_HEIGHT || mouseY < 0) {
            return false;
        }

        // cancelling the multiselection 
        userPointer.stopMultiselection();

        if (alignToCentre) {
            mouseX -= width / 2;
            mouseY -= height / 2;
        }

        ratioX = mouseX / MINIMIZED_WIDTH;
        ratioY = mouseY / MINIMIZED_HEIGHT;

        return {
            x: mapWidth * ratioX,
            y: mapHeight * ratioY
        };
    }

    /**
     * 	
     * Attach the Minimap object to the main GUI Panel
     * @param {object} panel Main GUI Panel
     * @param {integer} x Horizontal offset from the parent's anchor point 
     * @param {integer} y Vertical offset from the parent's anchor point 
     */
    appendTo(panel, x, y) {

        if (!panel) {
            throw 'Invalid Phaser.Sprite object!';
        }

        panel.addChild(this.getGraphics());
        this.graphics.x = x;
        this.graphics.y = y; // this is the place for the minimap on the big panel sprite

        this.panel = panel;

        // registering the callbacks listening for the mouse event in order to execute 
        // further logic when the user interacts with the Minimap
        this.setEventListeners();
    }

    /**
     * Resetting the graphics object
     * @return {void}
     */
    reset() {
        this.graphics.clear();
    }

    /**
     * Updating the minimap
     * @return {void} 				 
     */
    update() {
        this.reset();
        this.updateEntities();
        this.updateCamera();
    }

    /**
     * update all entities on the minimap
     * @return {void}
     */
    updateEntities() {
        this.entityManager.entities(':not(hibernated)').forEach(function(entity) {
            const x = entity.getSprite().x / this.map.getScreenWidth() * MINIMIZED_WIDTH;
            const y = entity.getSprite().y / this.map.getScreenHeight() * MINIMIZED_HEIGHT;
            const w = Math.max(1, entity.getDataObject().getWidth() / this.map.getScreenWidth() * MINIMIZED_WIDTH);
            const h = Math.max(1, entity.getDataObject().getHeight() / this.map.getScreenHeight() * MINIMIZED_HEIGHT);
            const colors = this.playerManager.getColors();
            const color = colors[entity.getDataObject().getTeam() - 1];

            this.graphics.beginFill(color);
            this.graphics.drawRect(x, y, w, h);
            this.graphics.endFill();

        }.bind(this));
    }

    /**
     * Redrawing the rectangle showing the viewport of the phaser camera object
     * @return {void} 
     */
    updateCamera() {
        const ratioX = ns.window.width / this.map.getScreenWidth();
        const ratioY = ns.window.height / this.map.getScreenHeight();
        const w = MINIMIZED_WIDTH * ratioX;
        const h = MINIMIZED_HEIGHT * ratioY;
        const x = this.phaserGame.camera.x / (this.map.getScreenWidth() - ns.window.width) * (MINIMIZED_WIDTH - w);
        const y = this.phaserGame.camera.y / (this.map.getScreenHeight() - ns.window.height) * (MINIMIZED_HEIGHT - h);
        const color = '0xFFFFFF';

        this.graphics.lineStyle(1, color, 1);
        this.graphics.drawRect(x, y, w, h);
    }

    /**
     * Returning the Phaser.Graphics object being used
     * @return {Phaser.Graphics} 
     */
    getGraphics() {
        return this.graphics;
    }

}
