/* global window */
const ns = window.fivenations;
const { PUBLIC_URL } = process.env;
const PATH_ASSETS_DATA = `${PUBLIC_URL}/assets/datas/effects/`;
const PATH_ASSETS_IMG = `${PUBLIC_URL}/assets/images/effects/`;

// const like object to describe all the effects participating in the gameplay
ns.effects = Object.assign(ns.effects || {}, {
  'blow-1': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow01.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow01.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-1.json`,
  },

  'blow-2': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow02.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow02.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-2.json`,
  },

  'blow-3': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow03.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow03.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-3.json`,
  },

  'blow-4': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow04.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow04.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-4.json`,
  },

  'blow-5a': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow05_0.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow05_0.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-5a.json`,
  },

  'blow-5b': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow05_1.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow05_1.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-5b.json`,
  },

  'blow-6': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow06.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow06.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-6.json`,
  },

  'blow-7': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow07.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow07.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-7.json`,
  },

  'blow-8': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow08.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow08.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-8.json`,
  },

  'blow-9': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow09.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow09.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-9.json`,
  },

  'blow-10': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow10.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow10.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-10.json`,
  },

  'blow-11': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow11.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow11.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-11.json`,
  },

  'blow-12': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow12.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow12.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-12.json`,
  },

  'blow-13': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blow13.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blow13.json`,
    dataURL: `${PATH_ASSETS_DATA}blow-13.json`,
  },

  blackhole: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_blackhole.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_blackhole.json`,
    dataURL: `${PATH_ASSETS_DATA}blackhole.json`,
  },

  construction: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_construction.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_construction.json`,
    dataURL: `${PATH_ASSETS_DATA}construction.json`,
  },

  'destruction-big': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_destruction_big.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_destruction_big.json`,
    dataURL: `${PATH_ASSETS_DATA}destruction-big.json`,
  },

  'destruction-medium': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_destruction_medium.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_destruction_medium.json`,
    dataURL: `${PATH_ASSETS_DATA}destruction-medium.json`,
  },

  'destruction-small': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_destruction_sm.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_destruction_sm.json`,
    dataURL: `${PATH_ASSETS_DATA}destruction-small.json`,
  },

  'destruction-bio-big': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_destruction_bio_big.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_destruction_bio_big.json`,
    dataURL: `${PATH_ASSETS_DATA}destruction-bio-big.json`,
  },

  'destruction-bio-medium': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_destruction_bio_medium.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_destruction_bio_medium.json`,
    dataURL: `${PATH_ASSETS_DATA}destruction-bio-medium.json`,
  },

  'destruction-bio-small': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_destruction_bio_sm.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_destruction_bio_sm.json`,
    dataURL: `${PATH_ASSETS_DATA}destruction-bio-small.json`,
  },

  destructivefield: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_destructivefield.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_destructivefield.json`,
    dataURL: `${PATH_ASSETS_DATA}destructivefield.json`,
  },

  nebulacloud: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_nebulacloud.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_nebulacloud.json`,
    dataURL: `${PATH_ASSETS_DATA}nebulacloud.json`,
  },

  sporecloud: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_sporecloud.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_sporecloud.json`,
    dataURL: `${PATH_ASSETS_DATA}sporecloud.json`,
  },

  'smoke-trail-1': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}smoke_trail01.png`,
    atlasURL: `${PATH_ASSETS_IMG}smoke_trail01.json`,
    dataURL: `${PATH_ASSETS_DATA}smoke-trail-1.json`,
  },

  'smoke-trail-2': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}smoke_trail02.png`,
    atlasURL: `${PATH_ASSETS_IMG}smoke_trail02.json`,
    dataURL: `${PATH_ASSETS_DATA}smoke-trail-2.json`,
  },

  'smoke-trail-3': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}smoke_trail03.png`,
    atlasURL: `${PATH_ASSETS_IMG}smoke_trail03.json`,
    dataURL: `${PATH_ASSETS_DATA}smoke-trail-3.json`,
  },

  'smoke-trail-4': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}smoke_trail04.png`,
    atlasURL: `${PATH_ASSETS_IMG}smoke_trail04.json`,
    dataURL: `${PATH_ASSETS_DATA}smoke-trail-4.json`,
  },

  'flash-blue-1': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-1.json`,
  },

  'flash-blue-2': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-2.json`,
  },

  'flash-blue-3': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-3.json`,
  },

  'flash-blue-4': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-4.json`,
  },

  'flash-blue-5': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-5.json`,
  },

  'flash-blue-6': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-6.json`,
  },

  'flash-blue-7': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-7.json`,
  },

  'flash-blue-8': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-blue-8.json`,
  },

  'flash-green-1': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-1.json`,
  },

  'flash-green-2': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-2.json`,
  },

  'flash-green-3': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-3.json`,
  },

  'flash-green-4': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-4.json`,
  },

  'flash-green-5': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-5.json`,
  },

  'flash-green-6': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-6.json`,
  },

  'flash-green-7': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-7.json`,
  },

  'flash-green-8': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-green-8.json`,
  },

  'flash-orange-1': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-1.json`,
  },

  'flash-orange-2': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-2.json`,
  },

  'flash-orange-3': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-3.json`,
  },

  'flash-orange-4': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-4.json`,
  },

  'flash-orange-5': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-5.json`,
  },

  'flash-orange-6': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-6.json`,
  },

  'flash-orange-7': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-7.json`,
  },

  'flash-orange-8': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-orange-8.json`,
  },

  'flash-white-1': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-1.json`,
  },

  'flash-white-2': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-2.json`,
  },

  'flash-white-3': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-3.json`,
  },

  'flash-white-4': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-4.json`,
  },

  'flash-white-5': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-5.json`,
  },

  'flash-white-6': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-6.json`,
  },

  'flash-white-7': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-7.json`,
  },

  'flash-white-8': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}effect_flash.png`,
    atlasURL: `${PATH_ASSETS_IMG}effect_flash.json`,
    dataURL: `${PATH_ASSETS_DATA}flash-white-8.json`,
  },

  'muzzleflash-bigcannon': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_bigcannon.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_bigcannon.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-blue': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_blue.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_blue.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-electric': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_electric.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_electric.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-green': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_green.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_green.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-phlegm': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_phlegm.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_phlegm.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-purple': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_purple.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_purple.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-red': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_red.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_red.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-spore': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_spore.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_spore.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-yellow': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_yellow.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_yellow.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-cannon': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_cannon.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_cannon.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'muzzleflash-greencannon': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}muzzleflash_green_cannon.png`,
    atlasURL: `${PATH_ASSETS_IMG}muzzleflash_green_cannon.json`,
    dataURL: `${PATH_ASSETS_DATA}muzzleflash.json`,
  },

  'hailstorm-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}hailstorm-wreckage.json`,
  },

  'stgeorge-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}stgeorge-wreckage.json`,
  },

  'avenger-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}avenger-wreckage.json`,
  },

  'avenger2-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}avenger2-wreckage.json`,
  },

  'icarus-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}icarus-wreckage.json`,
  },

  'kutuzov-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}kutuzov-wreckage.json`,
  },

  'pasteur-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}pasteur-wreckage.json`,
  },

  'dresda-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}dresda-wreckage.json`,
  },

  'teller-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}teller-wreckage.json`,
  },

  'commandcenter-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}commandcenter-wreckage.json`,
  },

  'miningstation-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}miningstation-wreckage.json`,
  },

  'civilianbase-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}civilianbase-wreckage.json`,
  },

  'solarstation-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}solarstation-wreckage.json`,
  },

  'shipfactory-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}shipfactory-wreckage.json`,
  },

  'dockyard-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}dockyard-wreckage.json`,
  },

  'merchantport-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}merchantport-wreckage.json`,
  },

  'researchcenter-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}researchcenter-wreckage.json`,
  },

  'astrometricstation-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}astrometricstation-wreckage.json`,
  },

  'fleetheadquarters-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}fleetheadquarters-wreckage.json`,
  },

  'defenseplatform-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}defenseplatform-wreckage.json`,
  },

  'fusionreactor-wreckage': {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}fed_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}fusionreactor-wreckage.json`,
  },

  flanker: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}flanker-wreckage.json`,
  },

  mothership: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}mothership-wreckage.json`,
  },

  invader: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}invader-wreckage.json`,
  },

  explorer: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}explorer-wreckage.json`,
  },

  drone: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}drone-wreckage.json`,
  },

  gathering: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}gathering-wreckage.json`,
  },

  clairvoyant: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}clairvoyant-wreckage.json`,
  },

  lancet: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}lancet-wreckage.json`,
  },

  theocrat: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}theocrat-wreckage.json`,
  },

  lifevessel: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}lifevessel-wreckage.json`,
  },

  rector: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}rector-wreckage.json`,
  },

  centralpyramid: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}centralpyramid-wreckage.json`,
  },

  masstransmitter: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}masstransmitter-wreckage.json`,
  },

  biosphere: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}biosphere-wreckage.json`,
  },

  powercore: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}powercore-wreckage.json`,
  },

  polaronsphere: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}polaronsphere-wreckage.json`,
  },

  obelisk: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}obelisk-wreckage.json`,
  },

  sanctuary: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}sanctuary-wreckage.json`,
  },

  synodum: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}synodum-wreckage.json`,
  },

  conservatory: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}conservatory-wreckage.json`,
  },

  monumentofwill: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}monumentofwill-wreckage.json`,
  },

  basilica: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}basilica-wreckage.json`,
  },

  theocratsseat: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}theocratsseat-wreckage.json`,
  },

  shieldgenerator: {
    preloading: true,
    spriteURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.png`,
    atlasURL: `${PATH_ASSETS_IMG}ath_unitandbuilding_wreckages.json`,
    dataURL: `${PATH_ASSETS_DATA}shieldgenerator-wreckage.json`,
  },
});

const NO_WRECKAGES_PER_NATION = 5;

['fed', 'ath', 'syl', 'tho'].forEach((nation) => {
  for (let i = 1; i <= NO_WRECKAGES_PER_NATION; i += 1) {
    ns.effects[`${nation}-wreck-${i}`] = {
      preloading: true,
      spriteURL: `${PATH_ASSETS_IMG}${nation}_wreck0${i}.png`,
      atlasURL: `${PATH_ASSETS_IMG}${nation}_wreck0${i}.json`,
      dataURL: `${PATH_ASSETS_DATA}${nation}-wreck-${i}.json`,
    };
  }
});

export default {
  /**
   * Loading all the correspondant resources for the effects listed
   * in the private *effects* object
   * @param {object} [preloader] Preloader object defined below
   * @return {void}
   */
  load(preloader) {
    Object.keys(ns.effects).forEach((key) => {
      if (!ns.effects[key].preloading) {
        return;
      }

      const spriteUrl = ns.effects[key].spriteURL;
      const atlasUrl = ns.effects[key].atlasURL;
      const dataUrl = ns.effects[key].dataURL;

      preloader.load.atlasJSONHash(key, spriteUrl, atlasUrl);
      preloader.load.json(key, dataUrl);
    }, preloader);
  },
};
