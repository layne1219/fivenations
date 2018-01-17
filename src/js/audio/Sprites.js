// This is the aggregation of AudioSprite to be preloaded
// when the game is being initialised
export const PreloadedSprites = ['sfx'];

// Definitions of AudioSprites
export const Sprites = {
  sfx: {
    asset: 'assets/audio/sfx.ogg',
    markers: {
      'alien death': {
        start: 1,
        duration: 1.0,
      },
      'boss hit': {
        start: 3,
        duration: 0.5,
      },
      escape: {
        start: 4,
        duration: 3.2,
      },
      meow: {
        start: 8,
        duration: 0.5,
      },
      numkey: {
        start: 9,
        duration: 0.1,
      },
      ping: {
        start: 10,
        duration: 1.0,
      },
      death: {
        start: 12,
        duration: 4.2,
      },
      shot: {
        start: 17,
        duration: 1.0,
      },
      squit: {
        start: 19,
        duration: 0.3,
      },
    },
  },
};
