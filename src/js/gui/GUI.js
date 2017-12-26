import Selector from './Selector';
import EnergyShield from './EnergyShield';
import JetEngine from './JetEngine';
import ColorIndicator from './ColorIndicator';
import StatusDisplay from './StatusDisplay';
import Panel from './Panel';
import Minimap from './Minimap';
import ControlPanel from './ControlPanel';
import ResourceDisplay from './ResourceDisplay';
import EntityDetailsDisplay from './EntityDetailsDisplay';
import Popup from './Popup';
import Button from './Button';

// Frame rate for the click animations
const CLICK_ANIM_FRAMERATE = 20;
const clickAnimations = {
  'click-move': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  'click-enemy': [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  'click-friendly': [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
};

let phaserGame;
let entityManager;
let playerManager;
let map;
let userPointer;
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

// reference to a Phaser.Sprite object that displays the click animation
let clickAnim;

function initPhaserGroup() {
  group = phaserGame.add.group();
  phaserGame.world.bringToTop(group);
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
    anim = clickAnim.animations.add(animation, clickAnimations[animation]);
    anim.onStart.add(() => {
      this.visible = true;
    }, clickAnim);
    anim.onComplete.add(() => {
      this.visible = false;
    }, clickAnim);
  });

  group.add(clickAnim);
}

function initGUIDisplayElements() {
  // Creating the Panel
  panel = new Panel(phaserGame);
  panel.appendTo(group);

  // Setting up the Minimap and attacing to the Panel
  minimap = new Minimap({
    phaserGame,
    map,
    entityManager,
    userPointer,
    playerManager,
  });
  minimap.appendTo(panel, 0, 61);

  // Setting up the EntityDetailsDisplay and linking it to the Panel
  entityDetailsDisplay = new EntityDetailsDisplay({ entityManager, phaserGame });
  entityDetailsDisplay.appendTo(panel, 200, 110);

  // ControlPanel
  controlPanel = new ControlPanel({ entityManager, phaserGame });
  controlPanel.appendTo(panel, 815, 15);

  // Resource display
  resourceDisplay = new ResourceDisplay({ playerManager, phaserGame });
  resourceDisplay.appendTo(panel, 425, 88);
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
    clickAnim.play(anim, CLICK_ANIM_FRAMERATE);
  },

  /**
   * Updating the renderable elements
   * @return {void}
   */
  update() {
    if (minimap) {
      minimap.update();
    }

    if (entityDetailsDisplay) {
      entityDetailsDisplay.update();
    }
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
   * Links the given entity to a new EnergyShield instance
   * @param {object} entity Instance of Eneity
   */
  addEnergyShield(entity) {
    const energyShield = new EnergyShield(phaserGame);
    energyShield.appendTo(entity);
    return energyShield;
  },

  /**
   * Links the given entity to a new JetEngine instance
   * @param {object} entity Instance of Eneity
   */
  addJetEngine(entity) {
    const jetEngine = new JetEngine(phaserGame);
    jetEngine.appendTo(entity);
    return jetEngine;
  },

  /**
   * Links the given entity to a new ColorIndicator instance
   * @param {object} entity Instance of Eneity
   */
  addColorIndicator(entity) {
    const colorIndicator = new ColorIndicator(phaserGame);
    colorIndicator.appendTo(entity);
    return colorIndicator;
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
   * Return a boolean value declaring whether the primary input is however the panel
   * @return {Boolean} [true if the primary input is over the panel sprite]
   */
  isHover() {
    return userPointer.isHover(panel);
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
   * Passing the entityManager object to retrive Entity objects in order to display
   * entity attributes on the Panel
   * @param {objet} [_entityManager] [reference to EntityManager singleton]
   * @param {void}
   */
  setEntityManager(_entityManager) {
    entityManager = _entityManager;
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
   * UserPointer object to register custom listeners for interactions with the mouse
   * @param {object} _userPointer UserPointer
   */
  setUserPointer(_userPointer) {
    userPointer = _userPointer;
    return this;
  },

  /**
   * Registers the playerManager instance into the execution context
   * @param {object} _playerManager [PlayerManager]
   */
  setPlayerManager(_playerManager) {
    playerManager = _playerManager;
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
