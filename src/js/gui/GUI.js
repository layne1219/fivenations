/* global window */
import Graphics from '../common/Graphics';
import {
  GROUP_GUI,
  NOTIFICATION_PANEL,
  CLICK_ANIMATIONS,
  DEFAULT_CANVAS_WIDTH,
  DEFAULT_CANVAS_HEIGHT,
} from '../common/Const';
import Selector from './Selector';
import ColorIndicator from './ColorIndicator';
import ProximityMonitor from './ProximityMonitor';
import StatusDisplay from './StatusDisplay';
import Panel from './Panel';
import Minimap from './Minimap';
import ControlPanel from './ControlPanel';
import ResourceDisplay from './ResourceDisplay';
import EntityDetailsDisplay from './EntityDetailsDisplay';
import BuildingPlacementDisplay from './BuildingPlacementDisplay';
import NotificationBar from './NotificationBar';
import FullScreenToggle from './FullScreenToggle';
import AudioToggle from './AudioToggle';
import Popup from './Popup';
import Button from './Button';

const ns = window.fivenations;

let phaserGame;
let map;
let singleton;

// reference to a Phaser.Group object that incorporate all the GUI elements
let group;

// reference to the Phaser.Image represents the basic panel element
let panel;

// reference to the Minimap object
let minimap;

// DataObjectProjector
let entityDetailsDisplay;

// reference to the ControlPanel object
let controlPanel;

// reference to the ResourceDisplay object
let resourceDisplay;

// reference notification bar
let notificationBar;

// reference to Building Placement Display
let buildingPlacementDisplay;

// reference to the FullScreenToggle Button
let fullScreenToggle;

// reference to AudioToggle Button
let audioToggle;

// reference to a Phaser.Sprite object that displays the click animation
let clickAnim;

function initPhaserGroup() {
  group = Graphics.getInstance().getGroup(GROUP_GUI);
}

/**
 * Initialise the sprite object and link all the animations
 * @return {void}
 */
function initClickAnimations() {
  let anim;
  clickAnim = phaserGame.add.image(0, 0, 'gui');
  clickAnim.visible = false;
  clickAnim.anchor.setTo(0.5, 0.5);

  ['click-move', 'click-enemy', 'click-friendly'].forEach((animation) => {
    anim = clickAnim.animations.add(
      animation,
      CLICK_ANIMATIONS.animations[animation],
    );
    anim.onStart.add(() => {
      clickAnim.visible = true;
    });
    anim.onComplete.add(() => {
      clickAnim.visible = false;
    });
  });

  group.add(clickAnim);
}

function initGUIDisplayElements() {
  // Building Placement Display
  buildingPlacementDisplay = new BuildingPlacementDisplay();
  buildingPlacementDisplay.appendTo(group);

  // Creating the Panel
  panel = new Panel();
  panel.appendTo(group);

  // Sets up the Minimap and attches it to the Panel
  minimap = new Minimap(map);
  minimap.appendTo(panel, 0, DEFAULT_CANVAS_HEIGHT - minimap.height);

  // Sets up the EntityDetailsDisplay and links it to the Panel
  entityDetailsDisplay = new EntityDetailsDisplay();
  entityDetailsDisplay.appendTo(
    panel,
    DEFAULT_CANVAS_WIDTH - 238,
    DEFAULT_CANVAS_HEIGHT - entityDetailsDisplay.height,
  );

  // ControlPanel
  controlPanel = new ControlPanel();
  controlPanel.appendTo(panel, 1142, 553);

  // Resource display
  resourceDisplay = new ResourceDisplay();
  resourceDisplay.appendTo(panel, 875, 20);

  // Notification Bar
  notificationBar = new NotificationBar(phaserGame);
  notificationBar.appendTo(panel, NOTIFICATION_PANEL.x, NOTIFICATION_PANEL.y);

  const gameWidth = ns.window.width;
  const gameHeight = ns.window.height;

  // FullScreen Toggle Button
  fullScreenToggle = new FullScreenToggle({
    x: gameWidth / 2 - 18 - 5,
    y: gameHeight / -2 + 18 + 35,
  });
  group.add(fullScreenToggle);

  // Mute / Unmute Audio
  audioToggle = new AudioToggle({
    x: gameWidth / 2 - 54 - 5,
    y: gameHeight / -2 + 18 + 35,
  });
  group.add(audioToggle);
}

function GUI() {
  initPhaserGroup();
  initClickAnimations();

  // initialise the panel according to which element it should conceal
  initGUIDisplayElements();
}

GUI.prototype = {
  /**
   * Placing and triggering the click animation onto the game area
   * @param  {integer} x
   * @param  {integer} y
   * @param  {integer} anim
   * @return {void}
   */
  putClickAnim(x, y, anim = 'click-move') {
    clickAnim.x = x;
    clickAnim.y = y;
    clickAnim.animations.stop(null, true);
    clickAnim.play(anim, CLICK_ANIMATIONS.frameRate);
  },

  /**
   * Updating the renderable elements
   * @return {void}
   */
  update() {
    minimap.update();
    entityDetailsDisplay.update();
  },

  /**
   * Linking the Selector object to a Entity
   * @param {Entity} entity
   */
  addSelector(entity) {
    if (!entity) {
      throw new Error('First parameter must be an instance of Entity!');
    }
    const selector = new Selector(phaserGame);
    selector.appendTo(entity);
    return selector;
  },

  /**
   * Links the given entity to a new ColorIndicator instance
   * @param {object} entity Instance of Entity
   */
  addColorIndicator(entity) {
    const colorIndicator = new ColorIndicator(phaserGame);
    colorIndicator.appendTo(entity);
    return colorIndicator;
  },

  /**
   * Links the given entity to a new ProximityMonitor instance
   * @param {object} entity Instance of Entity
   */
  addProximityMonitor(entity) {
    const monitor = new ProximityMonitor();
    monitor.appendTo(entity);
    return monitor;
  },

  /**
   * Links the StatusDisplay object to a Entity
   * @param {Entity} entity
   */
  addStatusDisplay(entity) {
    const statusDisplay = new StatusDisplay(phaserGame);
    statusDisplay.appendTo(entity);
    return statusDisplay;
  },

  /**
   * Adds a Basic GUI Popup to the GUI graphics group
   * @param {object} config - configuration object to instantiate the Popup
   */
  addPopup(config = {}) {
    const popup = new Popup(config);
    group.add(popup);
    return popup;
  },

  /**
   * Adds a Basic Button to the GUI graphics group
   * @param {object} config - configuration object to instantiate the Button
   */
  addButton(config = {}) {
    const { x, y } = config;
    const button = new Button(config);
    button.x = x || 0;
    button.y = y || 0;
    group.add(button);

    return button;
  },

  /**
   * Shows notification bar with the given text
   * @param {string} text - The text to be displayed
   */
  showNotification(text) {
    notificationBar.show(text);
  },

  /**
   * Shows a notification on the Minimap
   * @param {object} config - {x, y}
   */
  showMinimapNotification(config) {
    minimap.showNotification(config);
  },

  /**
   * Returns the BuildingPlacementDisplay instance
   * @return {object} BuildingPlacementDisplay
   */
  getBuildingPlacementDisplay() {
    return buildingPlacementDisplay;
  },

  /**
   * Return a boolean value declaring whether the primary input is however the panel
   * @return {Boolean} [true if the primary input is over the panel sprite]
   */
  isHover() {
    return minimap.isHover() || entityDetailsDisplay.isHover();
  },
};

export default {
  /**
   * Passing the ultimate Phaser.Game object in order to access basic Phaser functionality
   * @param {void}
   */
  setGame(game) {
    phaserGame = game;
    return this;
  },

  /**
   * Passing the Map object to fetch map details mostly for rendering the Minimap
   * @param {objet} [_map] [reference to Map singleton]
   * @param {void}
   */
  setMap(_map) {
    map = _map;
    return this;
  },

  /**
   * Accessing the singleton instance of the GUI
   * @param {boolean} forceNewInstance
   * @return {object} GUI
   */
  getInstance(forceNewInstance) {
    if (!phaserGame) {
      throw new Error('Invoke setGame first to pass the Phaser Game entity!');
    }
    if (!singleton || forceNewInstance) {
      singleton = new GUI();
    }
    return singleton;
  },
};
