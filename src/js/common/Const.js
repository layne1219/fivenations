/* global Phaser */

// ==============================================================
// ===                           CANVAS                       ===
// ==============================================================
// Canvas
export const DEFAULT_CANVAS_WIDTH = 1366;
export const DEFAULT_CANVAS_HEIGHT = 768;

// ==============================================================
// ===                        TRANSLATIONS                    ===
// ==============================================================
// Supported Locales
export const SUPPORTED_LOCALES = ['en_US', 'en_GB'];

// Default Local
export const DEFAUT_LOCALE = SUPPORTED_LOCALES[0];

// ==============================================================
// ===                             MAP                        ===
// ==============================================================
// Map constants
export const TILE_WIDTH = 40;
export const TILE_HEIGHT = 40;
export const SCROLL_SPEED = 10;

// ==============================================================
// ===                           ENTITIES                     ===
// ==============================================================
// size categories for entities
export const ENTITY_SIZES = {
  xsm: {
    width: 25,
    height: 25,
  },
  sm: {
    width: 50,
    height: 50,
  },
  m: {
    width: 75,
    height: 75,
  },
  l: {
    width: 100,
    height: 100,
  },
  xl: {
    width: 125,
    height: 125,
  },
};

// GUI sizes for entities
export const ENTITY_GUI_SIZES = {
  big: [100, 149],
  extrabig: [150, 999],
  medium: [50, 99],
  small: [0, 49],
};

// helper constants for entity related functionalities
export const SLOW_MANOUVERABAILITY_TRESHOLD = 25;
export const MAX_SELECTABLE_UNITS = 22;
export const SHIELD_CHARGE_RATE_IN_MILLISECONDS = 2000;
export const SHIELD_ACTIVITY_TRESHOLD = 10;
export const ANIMATION_IDLE_FOREVER = 'idle-forever';

// Offset for all entity animations when the icons are bundled
// into the entity's spritesheet
export const ANIMATION_OFFSET_WHEN_ICONS_ARE_INTEGRATED = 3;

// Icon ids placed into the entity spridesheet
export const ENTITY_ICON_CONSTRUCT = 0;
export const ENTITY_ICON = 1;
export const ENTITY_ICON_DIMENSIONS = {
  width: 128,
  height: 111,
};

export const ENTITY_ICON_SMALL = 2;
export const ENTITY_ICON_SMALL_DIMENSIONS = {
  width: 51,
  height: 51,
};

// Weapon constants
export const WEAPON_INSTANCE_DELAY = 10;
export const WEAPON_ACCURACY_SPREAD_IN_DEGREES = 60;
export const WEAPON_ACCURACY_SPREAD_IN_RADIAN = Phaser.Math.degToRad(WEAPON_ACCURACY_SPREAD_IN_DEGREES);

// Energy shield
export const ENERGY_SHIELD = {
  relativeRatioToEntity: 1.3,
  width: 197,
  height: 197,
  sprite: 'energy-shield',
  animation: {
    frames: [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
    ],
    rate: 25,
  },
};

// ==============================================================
// ===                     GRAPHICS GROUPS                    ===
// ==============================================================
// group IDs
export const GROUP_EFFECTS = 'effects';
export const GROUP_ENTITIES = 'entities';
export const GROUP_ENTITIES_BUILDINGS = 'entities-buildings';
export const GROUP_FOGOFWAR = 'fogofwar';
export const GROUP_GUI = 'gui';
export const GROUP_TOOLTIPS = 'tooltips';

// ==============================================================
// ===                         STARFIELD                      ===
// ==============================================================
// Background tile
export const DEFAULT_STARFIELD_BACKGROUND_TILE = 'starfield-1';

// ==============================================================
// ===                            GUI                         ===
// ==============================================================
// Font
export const DEFAULT_FONT = {
  font: '11px BerlinSansFB-Reg',
  color: '#77C7D2',
};

export const MENU_FONT = {
  font: '11px conthraxsemibold',
  color: '#99eded',
  onHover: '#ffffff',
  onDisabled: '#999999',
};

// Tooltip default padding coordinates
export const DEFAULT_TOOLTIP_PADDING = {
  x: 10,
  y: -20,
};

export const TOOLTIPS_DIMENSIONS = {
  width: 139,
  height: 39,
};

// Generic GUI Button
export const GUI_BUTTON = {
  spritesheet: {
    id: 'gui',
    url: 'gui/GUI_elements.png',
  },
  frames: {
    over: 197,
    out: 196,
    down: 197,
  },
  style: {
    font: '11px BerlinSansFB-Reg',
    fill: '#FFFFFF',
    boundsAlignH: 'center',
    wordWrap: true,
    align: 'center',
  },
};

export const GUI_CLOSE_BUTTON = {
  spritesheet: {
    id: 'gui',
    url: 'gui/GUI_elements.png',
  },
  frames: {
    over: 0,
    out: 0,
    down: 0,
  },
};

export const GUI_POPUP = {
  spritesheet: {
    id: 'gui',
    url: 'gui/GUI_elements.png',
  },
  frames: {
    background: 199,
  },
  style: {
    font: '16px BerlinSansFB-Reg',
    fill: '#FFFFFF',
    boundsAlignH: 'center',
    wordWrap: true,
    align: 'center',
  },
  padding: 45,
};

// Notification Bar
export const NOTIFICATION_PANEL = {
  x: 0,
  // offset from Panel
  y: -100,
  width: DEFAULT_CANVAS_WIDTH,
  height: Math.round(DEFAULT_CANVAS_HEIGHT / 10),
  fadeAnimationDuration: 500,
  displayTime: 3000,
};

// Click anination
export const CLICK_ANIMATIONS = {
  frameRate: 20,
  animations: {
    'click-move': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    'click-enemy': [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    'click-friendly': [
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
    ],
  },
};

// ==============================================================
// ===                         PLAYERS                        ===
// ==============================================================
// Colours
export const PLAYER_MANAGER_COLORS = [
  '0x08A2EA',
  '0x10B308',
  '0xF28209',
  '0xBA10D9',
  '0xD40F0F',
  '0xF8F8F9',
  '0xE5C410',
  '0x65615D',
];

// ==============================================================
// ===                          AUDIO                         ===
// ==============================================================
export const DEFAULT_AUDIO_SPRITE = 'sfx';
