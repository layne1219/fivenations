/**
 * Entity constanst 
 */
 // size categories for entities
export const ENTITY_SIZES = {
  "xsm": {
    "width": 35,
    "height": 35
  },
  "sm": {
    "width": 50,
    "height": 50
  },
  "m": {
    "width": 90,
    "height": 90
  },
  "l": {
    "width": 130,
    "height": 130
  },
  "xl": {
    "width": 170,
    "height": 170
  }        
};

// helper constants for entity related functionalities 
export const SLOW_MANOUVERABAILITY_TRESHOLD = 25;
export const MAX_SELECTABLE_UNITS = 22;
export const ANIMATION_IDLE_FOREVER = 'idle-forever';

// Offset for all entity animations when the icons are bundled
// into the entity's spritesheet 
export const ANIMATION_OFFSET_WHEN_ICONS_ARE_INTEGRATED = 3;
