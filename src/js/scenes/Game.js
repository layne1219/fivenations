/* global window, Phaser */
import EasyStar from 'easystarjs';
import Signals from '../common/Signals';
import Graphics from '../common/Graphics';
import Scriptbox from '../common/Scriptbox';
import Map from '../map/Map';
import PlayerManager from '../players/PlayerManager';
import EntityManager from '../entities/EntityManager';
import EffectManager from '../effects/EffectManager';
import CollisionManager from '../common/CollisionManager';
import TranslationManager from '../common/TranslationManager';
import GUI from '../gui/GUI';
import GUIActivityManager from '../gui/ActivityManager';
import UserPointer from '../gui/UserPointer';
import AudioManager from '../audio/AudioManager';
import UserKeyboard from '../gui/UserKeyboard';
import EventBusExecuter from '../sync/EventBusExecuter';
import EventEmitter from '../sync/EventEmitter';

const ns = window.fivenations;
let authoritative = false;

function Game() {}

Game.prototype = {
  init(params = {}) {
    this.script = params.script;
  },

  create() {
    // publishing the Game object
    ns.game = this;

    this.signals = Signals.create();

    // disables Phaser from pausing the game when it loses focus
    this.stage.disableVisibilityChange = false;

    // -----------------------------------------------------------------------
    //                                  Graphics
    // -----------------------------------------------------------------------
    // Graphics object gathering functonality that assist in rendering
    Graphics.setGame(this.game);
    this.graphics = Graphics.getInstance(true); // force new instance

    // -----------------------------------------------------------------------
    //                                  Map
    // -----------------------------------------------------------------------
    // Creates a singleton reference, but the map hasn't been
    // specified yet. It is supposed to be populated from a
    // ScriptBox entry when the game scene is activated
    this.map = new Map(this.game);

    // -----------------------------------------------------------------------
    //                               Player manager
    // -----------------------------------------------------------------------
    this.playerManager = PlayerManager.getInstance(true);

    // -----------------------------------------------------------------------
    //                              EntityManager
    // -----------------------------------------------------------------------
    EntityManager.setGame(this.game);
    this.entityManager = EntityManager.getInstance(true);

    // -----------------------------------------------------------------------
    //                              EffectManager
    // -----------------------------------------------------------------------
    EffectManager.setGame(this.game);
    this.effectManager = EffectManager.getInstance(true);

    // -----------------------------------------------------------------------
    //                              CollisionManager
    // -----------------------------------------------------------------------
    CollisionManager.setGame(this.game);
    this.collisionManager = CollisionManager.getInstance();

    // -----------------------------------------------------------------------
    //                            TranslationManager
    // -----------------------------------------------------------------------
    TranslationManager.setGame(this.game);
    this.translationManager = TranslationManager.getInstance();

    // -----------------------------------------------------------------------
    //                              EventEmitter
    // -----------------------------------------------------------------------
    EventEmitter.create({
      playerManager: this.playerManager,
      entityManager: this.entityManager,
      effectManager: this.effectManager,
    });
    this.eventEmitter = EventEmitter.getInstance();
    this.eventEmitter.local.addEventListener('player/create', () => {
      authoritative = this.playerManager.getUser().isAuthorised();
    });

    // -----------------------------------------------------------------------
    //                              AudioManager
    // -----------------------------------------------------------------------
    AudioManager.setGame(this.game);
    this.audioManager = AudioManager.getInstance();

    // -----------------------------------------------------------------------
    //                              UserPointer
    // -----------------------------------------------------------------------
    UserPointer.setGame(this.game);
    this.userPointer = UserPointer.getInstance(true);

    // Right Mouse Button to send units to a position
    this.userPointer.on('rightbutton/down', () => {
      // @TODO refactor this function as it has become too complex and long
      const coords = this.userPointer.getRealCoords();
      let resetActivityQueue = true;
      let targetEntity;

      // If the user is hovering the mouse pointer above the GUI, the selection
      // must remain untouched
      if (GUI.getInstance().isHover()) {
        this.userPointer.dispatch('rightbutton/down/gui');
        return;
      }

      // checks whether the user hovers an entity
      const entitiesHovering = this.entityManager.entities().filter((entity) => {
        if (entity.isHover()) {
          targetEntity = entity;
          return true;
        }
        return false;
      });

      if (UserKeyboard.getInstance().isDown(Phaser.KeyCode.SHIFT)) {
        resetActivityQueue = false;
      }

      if (entitiesHovering.length > 0) {
        const selectedEntities = this.eventEmitter.synced.entities(':user:selected');

        // if the entity is hostile we should trigger the attack short hand
        if (
          this.playerManager.isEntityHostileToPlayer(
            targetEntity,
            this.playerManager.getUser(),
          )
        ) {
          selectedEntities.attack({
            targetEntity,
            resetActivityQueue,
          });
        } else {
          // short hand for follow
          selectedEntities.follow({
            targetEntity,
            resetActivityQueue,
          });
        }

        targetEntity.selectedAsTarget();
      } else {
        this.eventEmitter.synced.entities(':user:selected:not(building)').move({
          x: coords.x,
          y: coords.y,
          resetActivityQueue,
        });

        this.GUI.putClickAnim(coords.x, coords.y);
      }
    });

    // Unselecting units when clicking over an area with no entities underneath
    this.userPointer.on('leftbutton/down', (mousePointer) => {
      // If the user is hovering the mouse pointer above the GUI, the selection must
      // remain untouched
      if (GUI.getInstance().isHover()) {
        this.userPointer.dispatch('leftbutton/down/gui');
        return;
      }

      if (this.guiActivityManager.hasActiveSelection()) {
        this.userPointer.dispatch('leftbutton/down/activity', mousePointer);
        return;
      }

      if (
        this.entityManager.entities().filter(entity => entity.isHover())
          .length === 0
      ) {
        this.userPointer.dispatch('leftbutton/down/disselect');
      }
    });

    // If the user pointer isn't over the GUI area, nor any entities
    this.userPointer.on('leftbutton/down/disselect', () => {
      this.entityManager.unselectAll();
    });

    this.userPointer.on('multiselector/up', (multiselector) => {
      this.entityManager.entities().forEach((entity) => {
        if (!entity.isEntityControlledByUser() && !ns.mapEditorMode) {
          return;
        }
        if (entity.isInside(multiselector)) {
          entity.select();
        }
      });
    });

    // Proxy mouse pointer events to Global Event Dispatcher
    const dispatcher = this.eventEmitter.local;
    const { dispatch } = dispatcher;
    this.userPointer.on(
      'leftbutton/down',
      dispatch.bind(dispatcher, 'pointer/leftclick'),
    );
    this.userPointer.on(
      'rightbutton/down',
      dispatch.bind(dispatcher, 'pointer/rightclick'),
    );

    // -----------------------------------------------------------------------
    //                              UserKeyboard
    // -----------------------------------------------------------------------
    // Set up UserKeyboard
    UserKeyboard.setGame(this.game);
    this.userKeyboard = UserKeyboard.getInstance(true);

    this.userKeyboard
      .on('cursor/down', this.map.scrollDown.bind(this.map))
      .on('cursor/up', this.map.scrollUp.bind(this.map))
      .on('cursor/left', this.map.scrollLeft.bind(this.map))
      .on('cursor/right', this.map.scrollRight.bind(this.map));

    this.userKeyboard.on('key/delete', () => {
      this.eventEmitter.synced.entities(':selected').remove();
    });

    // -----------------------------------------------------------------------
    //                              GUI
    // -----------------------------------------------------------------------
    // Set up the GUI object
    this.GUI = GUI.setGame(this.game)
      .setMap(this.map)
      .setEntityManager(this.entityManager)
      .setUserPointer(this.userPointer)
      .setPlayerManager(this.playerManager)
      .getInstance(true);

    // -----------------------------------------------------------------------
    //                                EventBus
    // -----------------------------------------------------------------------
    // !!! IMPORTANT TO HAVE THE EVENTBUS RESET BEFORE SCRIPTBOX !!!
    this.eventBusExecuter = EventBusExecuter.getInstance();
    this.eventBusExecuter.reset();

    // -----------------------------------------------------------------------
    //                              Scriptbox
    // -----------------------------------------------------------------------
    this.scriptbox = Scriptbox.getInstance();
    this.scriptbox.run(this.script || 'default', this);

    // -----------------------------------------------------------------------
    //                              GUI.ActivityManager
    // -----------------------------------------------------------------------
    this.guiActivityManager = GUIActivityManager.getInstance();

    // -----------------------------------------------------------------------
    //                              Physic engine
    // -----------------------------------------------------------------------
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // -----------------------------------------------------------------------
    //                                QuadTree
    // -----------------------------------------------------------------------
    this.entityManager.createQuadTree(this.map);

    // -----------------------------------------------------------------------
    //                              A* Pathfinder
    // -----------------------------------------------------------------------
    // eslint-disable-next-line new-cap
    this.easyStar = new EasyStar.js();
    // avoids easyStar to hold up the main thread by limiting the number of
    // calculations per iteration
    this.easyStar.setIterationsPerCalculation(1000);
    this.easyStar.setGrid(this.map.getCollisionMap());
    this.easyStar.setAcceptableTiles([0]);
    // refresh the grid when the collision map changes
    this.map.getCollisionMap().on('change', (map) => {
      this.easyStar.setGrid(map);
    });
  },

  update() {
    // Execute all the registered events on the EventBus
    this.eventBusExecuter.run();

    // Rendering the map
    this.map.update(this.entityManager);

    if (this.paused !== true) {
      // updating entity attributes according to the time elapsed
      this.entityManager.update(authoritative, this.game.time.elapsedMS);

      // updates effects
      this.effectManager.update(authoritative);

      // collision handling
      this.collisionManager.update(authoritative);
    }

    // Rendering GUI elements
    this.GUI.update();

    // User input - mouse/touch
    this.userPointer.update();

    // User input - keyboard
    this.userKeyboard.update();

    this.game.time.advancedTiming = true;
    this.game.debug.text(this.game.time.fps || '--', 2, 14, '#00ff00');
  },
};

export default Game;
