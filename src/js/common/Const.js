
/* global Phaser */
// size categories for entities
export const ENTITY_SIZES = {
  xsm: {
    width: 35,
    height: 35,
  },
  sm: {
    width: 50,
    height: 50,
  },
  m: {
    width: 90,
    height: 90,
  },
  l: {
    width: 130,
    height: 130,
  },
  xl: {
    width: 170,
    height: 170,
  },
};

// GUI sizes for entities
export const ENTITY_GUI_SIZES = {
  big: [100, 149],
  extrabig: [150, 999],
  medium: [50, 99],
  small: [0, 49],
};

// group IDs
export const GROUP_EFFECTS = 'effects';
export const GROUP_ENTITIES = 'entities';
export const GROUP_ENTITIES_BUILDINGS = 'entities-buildings';
export const GROUP_FOGOFWAR = 'fogofwar';

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
export const WEAPON_ACCURACY_SPREAD_IN_RADIAN =
  Phaser.Math.degToRad(WEAPON_ACCURACY_SPREAD_IN_DEGREES);

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
