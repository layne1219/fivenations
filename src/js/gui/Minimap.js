/* global window, Phaser */
/* eslint class-methods-use-this: 0 */
import UserKeyboard from './UserKeyboard';
import EventEmitter from '../sync/EventEmitter';
import MinimapNotification from './MinimapNotification';

const ns = window.fivenations;
const MINIMIZED_WIDTH = 160;
const MINIMIZED_HEIGHT = 160;

const COLOR_EXPLORED = '0x001A45';
const COLOR_UNEXPLORED = '0x101010';

const notifications = [];
let timer;

export default class Minimap extends Phaser.Group {
  /**
   * Creats a Minimap instance
   * @param {[object]} phaserGame     [reference to a Game instance]
   * @param {[object]} map()          [reference to a Map instance]
   * @param {[object]} entityManager  [reference to EntityManager]
   * @param {[object]} UserPointer    [reference to UserPointer]
   */
  constructor({
    phaserGame, map, entityManager, userPointer, playerManager,
  }) {
    super(phaserGame);
    this.phaserGame = phaserGame;
    this.userPointer = userPointer;
    this.playerManager = playerManager;

    // referencies to local variables
    this.map = map;
    this.entityManager = entityManager;

    // cache to optimaze rendering
    this.cache = {};

    // calculating the ratio
    this.ratio = {
      x: MINIMIZED_WIDTH / this.map.getScreenWidth(),
      y: MINIMIZED_HEIGHT / this.map.getScreenHeight(),
    };
  }

  /**
   * Attaches the Minimap object to the given GUI Panel
   * @param {object} panel Main GUI Panel
   * @param {integer} x Horizontal offset from the parent's anchor point
   * @param {integer} y Vertical offset from the parent's anchor point
   */
  appendTo(panel, x, y) {
    if (!panel) {
      throw new Error('Invalid Phaser.Sprite object!');
    }

    panel.addChild(this);
    this.x = x;
    this.y = y; // this is the place for the minimap on the big panel sprite

    this.panel = panel;

    // creates the display layers
    this.initDisplayLayers();

    // registering the callbacks listening for the mouse event in order to execute
    // further logic when the user interacts with the Minimap
    this.setEventListeners();

    // executes a timeout to redraw the minimap at regular
    // intervals
    this.startDelayedEntityUpdateLoop();
  }

  /**
   * Creates the display layers for entities, fogofwar and other
   * dynamic indicators that will be displayed on the Minimap
   */
  initDisplayLayers() {
    // fog of war layer goes at the bottom
    this.initFogOfWarLayer();
    this.initEntityLayer();
    this.initIndicatorLayer();
  }

  /**
   * Creates the graphics layer onto which the Minimap elements
   * will be drawn during the update function
   */
  initEntityLayer() {
    this.entityGraphics = this.phaserGame.make.graphics(0, 0);
    this.add(this.entityGraphics);
  }

  /**
   * Creates the minimap layer onto which the FogOfWar tiles will be shown
   */
  initFogOfWarLayer() {
    this.fogOfWarGraphics = this.phaserGame.make.graphics(0, 0);
    this.fogOfWarGraphics.beginFill(COLOR_UNEXPLORED);
    this.fogOfWarGraphics.drawRect(0, 0, MINIMIZED_WIDTH, MINIMIZED_HEIGHT);
    this.fogOfWarGraphics.endFill();
    this.add(this.fogOfWarGraphics);
  }

  /**
   * Creates the minimap layer onto which the FogOfWar tiles will be shown
   */
  initIndicatorLayer() {
    this.indicatorGraphics = this.phaserGame.make.graphics(0, 0);
    this.add(this.indicatorGraphics);
  }

  /**
   * Registers the event listeners
   */
  setEventListeners() {
    this.setLeftButtonListeners();
    this.setRightButtonListeners();

    // registers listener to the fogofwar/change event that is
    // emitted when the fogOfWar has been updated
    const dispatcher = EventEmitter.getInstance().local;
    dispatcher.addEventListener(
      'fogofwar/change',
      this.updateFogOfWar.bind(this),
    );
  }

  setLeftButtonListeners() {
    // making the minimap area clickable
    this.userPointer.on('leftbutton/move', (userPointer) => {
      const coords = this.getMouseCoords(
        userPointer,
        this.map,
        this.panel,
        this.graphics,
        true,
      );

      // if getMouseCoords returns with false then the coordinates are not legit
      if (!coords) {
        return;
      }

      this.map.scrollTo(coords.x, coords.y);
    });
  }

  setRightButtonListeners() {
    // making the minimap area clickable
    this.userPointer.on('rightbutton/down', (userPointer) => {
      const coords = this.getMouseCoords(
        userPointer,
        this.map,
        this.panel,
        this.graphics,
      );
      let resetActivityQueue = true;

      // if getMouseCoords returns with false then the coordinates are not legit
      if (!coords) {
        return;
      }

      if (UserKeyboard.getInstance().isDown(Phaser.KeyCode.SHIFT)) {
        resetActivityQueue = false;
      }

      EventEmitter.getInstance()
        .synced.entities(':user:selected')
        .move({
          x: coords.x,
          y: coords.y,
          resetActivityQueue,
        });
    });
  }

  getMouseCoords(userPointer, map, alignToCentre) {
    const mapWidth = map.getScreenWidth();
    const mapHeight = map.getScreenHeight();
    let ratioX = ns.window.width / mapWidth;
    let ratioY = ns.window.height / mapHeight;
    const width = MINIMIZED_WIDTH * ratioX;
    const height = MINIMIZED_HEIGHT * ratioY;
    const mouseCoords = userPointer.getRealCoords();
    let mouseX = mouseCoords.x - this.panel.x - this.entityGraphics.x;
    let mouseY = mouseCoords.y - this.panel.y - this.entityGraphics.y;

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
      y: mapHeight * ratioY,
    };
  }

  /**
   * Starts the indepenent timer to update the minimap at regular intervals
   */
  startDelayedEntityUpdateLoop() {
    if (timer) clearTimeout(timer);
    const loop = () => {
      this.updateEntities();
      timer = setTimeout(loop, 500);
    };
    loop();
  }

  /**
   * Updates the minimap
   */
  update() {
    this.indicatorGraphics.clear();
    this.updateCamera();
    this.updateNotifications();
  }

  /**
   * update all entities on the minimap
   */
  updateEntities() {
    const fogOfWar = this.map.getFogOfWar();
    this.entityGraphics.clear();
    this.entityManager
      .entities(':not(hibernated)')
      .filter((entity) => {
        const coords = entity.getTile();
        return fogOfWar.isVisible(coords[0], coords[1]);
      })
      .forEach((entity) => {
        const DO = entity.getDataObject();
        const x =
          entity.getSprite().x / this.map.getScreenWidth() * MINIMIZED_WIDTH;
        const y =
          entity.getSprite().y / this.map.getScreenHeight() * MINIMIZED_HEIGHT;
        const w = Math.max(
          1,
          DO.getWidth() / this.map.getScreenWidth() * MINIMIZED_WIDTH,
        );
        const h = Math.max(
          1,
          DO.getHeight() / this.map.getScreenHeight() * MINIMIZED_HEIGHT,
        );

        let color = DO.getCustomMinimapColor();
        if (!color) {
          const colors = this.playerManager.getColors();
          color = colors[DO.getTeam() - 1];
        }

        this.entityGraphics.beginFill(color);
        this.entityGraphics.drawRect(x, y, w, h);
        this.entityGraphics.endFill();
      });
  }

  /**
   * Redrawing the rectangle showing the viewport of the phaser camera object
   */
  updateCamera() {
    const ratioX = ns.window.width / this.map.getScreenWidth();
    const ratioY = ns.window.height / this.map.getScreenHeight();
    const w = MINIMIZED_WIDTH * ratioX;
    const h = MINIMIZED_HEIGHT * ratioY;
    const x =
      this.phaserGame.camera.x /
      (this.map.getScreenWidth() - ns.window.width) *
      (MINIMIZED_WIDTH - w);
    const y =
      this.phaserGame.camera.y /
      (this.map.getScreenHeight() - ns.window.height) *
      (MINIMIZED_HEIGHT - h);
    const color = '0xFFFFFF';

    this.indicatorGraphics.lineStyle(1, color, 1);
    this.indicatorGraphics.drawRect(x, y, w, h);
  }

  /**
   * Redrawing the rectangle showing the viewport of the phaser camera object
   * @return {void}
   */
  updateNotifications() {
    notifications.forEach(notification =>
      notification.update(this.indicatorGraphics));
  }

  /**
   * Updates Minimap with the visible tiles of the FogOfWar layer
   */
  updateFogOfWar(updatedTiles) {
    const fogOfWar = this.map.getFogOfWar();
    const tiles = fogOfWar.getMatrix();
    let cache = this.cache.fogOfWar;
    if (!cache) {
      cache = {};
      cache.mapWidth = tiles.length - 1;
      cache.mapHeight = tiles[0].length - 1;
      cache.tileWidthOnMinimap = MINIMIZED_WIDTH / cache.mapWidth;
      cache.tileHeightOnMinimap = MINIMIZED_HEIGHT / cache.mapHeight;
      this.cache.fogOfWar = cache;
    }
    updatedTiles.forEach((tile) => {
      const x = tile.x / cache.mapWidth * MINIMIZED_WIDTH;
      const y = tile.y / cache.mapHeight * MINIMIZED_HEIGHT;
      this.fogOfWarGraphics.beginFill(COLOR_EXPLORED);
      this.fogOfWarGraphics.drawRect(
        x,
        y,
        cache.tileWidthOnMinimap,
        cache.tileHeightOnMinimap,
      );
      this.fogOfWarGraphics.endFill();
    });
  }

  /**
   * Places a notification on the Minimap and triggers its animation
   * @param {object} config - {x, y}
   */
  showNotification(config) {
    const notification = new MinimapNotification({
      minimap: this,
      map: this.map,
      ...config,
    });
    notifications.push(notification);
  }

  /**
   * Removes notification from the private collection
   * @param {object} entity Entity instance
   */
  removeNotification(notification) {
    for (let i = notifications.length - 1; i >= 0; i -= 1) {
      if (notification === notifications[i]) {
        notifications.splice(i, 1);
      }
    }
  }
}

export { MINIMIZED_WIDTH, MINIMIZED_HEIGHT };
