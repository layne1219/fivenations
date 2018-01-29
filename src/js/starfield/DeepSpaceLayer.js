/* global window */
/* eslint class-methods-use-this: 0 */
import Graphics from '../common/Graphics';
import SpaceObject from './SpaceObject';

const ns = window.fivenations;
const sprites = {};

class DeepSpaceLayer {
  constructor(map, generator) {
    this.setMap(map);
    this.setGame(map.getGame());
    this.createTexture();
    this.createContainer();
    this.addContainerToStarfieldGroup();
    this.createSpaceObjects(generator);
  }

  setMap(map) {
    if (!map) {
      throw new Error('Map instance must be passed as first parameter!');
    }
    this.map = map;
  }

  setGame(game) {
    if (!game) {
      throw new Error('Phaser.Game instance must be passed as first parameter!');
    }
    this.game = game;
  }

  createTexture() {
    const { width, height } = ns.window;

    this.texture = this.game.add.renderTexture(
      width,
      height,
      'Starfield.Stars.Texture',
    );
  }

  createContainer() {
    this.container = this.game.add.image(0, 0, this.texture);
    this.container.fixedToCamera = true;
  }

  addContainerToStarfieldGroup() {
    this.group = Graphics.getInstance().getGroup('starfield');
    this.group.add(this.container);
  }

  /**
   * Fetches the sprite by the given id. If it doesn't exists yet it
   * creates it and stores it in the local cache
   * @param {string} id
   * @return {object} Phaser.Sprite
   */
  getSprite(id) {
    if (!id) {
      throw new Error('Invalid id was given the fetch SpaceOjbect sprite!');
    }
    if (!sprites[id]) {
      sprites[id] = this.game.make.sprite(0, 0, id);
    }
    return sprites[id];
  }

  createSpaceObjects(generatorClass) {
    this.spaceObjects = [];
    if (!generatorClass) return;
    this.generateSpaceObjects(generatorClass);
    this.sortSpaceObjects();
  }

  generateSpaceObjects(Generator) {
    if (!Generator) return;
    const generatorInstance = new Generator(this);
    generatorInstance.generate();
    this.spaceObjects = generatorInstance.getSpaceObjects();
  }

  sortSpaceObjects() {
    this.spaceObjects.sort((a, b) => a.z - b.z);
  }

  update() {
    // don't need to update the background if there is no scroll event
    // since the last update
    if (!this.map.isDirty()) return;
    for (let i = 0, l = this.spaceObjects.length; i < l; i += 1) {
      this.spaceObjects[i].update(this.texture, this.game, i === 0);
    }
  }

  remove() {
    this.clear();
    this.group.remove(this.container);
  }

  clear() {
    while (this.spaceObjects.length) {
      const spaceObject = this.spaceObjects.pop();
      spaceObject.remove();
    }
  }

  add(config) {
    if (!config || !config.id) return;
    // extract basic information from the given object parameter
    const {
      id, x, y, z, scale,
    } = config;
    const dataObject = this.game.cache.getJSON(id);
    const { sprite, customFrame, animations } = dataObject;
    const spriteObj = this.getSprite(sprite);
    spriteObj.frame = customFrame;
    const clone = this.game.make.sprite(0, 0, spriteObj.generateTexture());

    // create the SpaceObject
    const spaceObject = new SpaceObject(clone);

    // sets all required attributes according to the given configuration
    spaceObject
      .setX(x)
      .setY(y)
      .setZ(z)
      .setScale(scale)
      .setAnimation(animations);

    // adds the newly created SpaceObject to the collection
    this.spaceObjects.push(spaceObject);
    // updates the sequence of the objects based on their Z value
    this.sortSpaceObjects();
  }

  getGame() {
    return this.game;
  }

  getMap() {
    return this.map;
  }

  getSprites() {
    return sprites;
  }
}

export default DeepSpaceLayer;
