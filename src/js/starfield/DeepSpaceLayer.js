/* global window */
/* eslint class-methods-use-this: 0 */
import Graphics from '../common/Graphics';
import SpaceObject from './SpaceObject';
import StarGenerator from './StarGenerator';

const ns = window.fivenations;
const sprites = {};

class DeepSpaceLayer {
  /**
   * Returns the DeepSpaceLayer instance that is responsable to
   * manage and render all parallex background elements
   * @param {object} map - Map instance
   * @param {object} generator - SpaceGenerator instance
   */
  constructor(map, generator) {
    // basic initialisation
    this.setMap(map);
    this.setGame(map.getGame());
    this.createTexture();
    this.createContainer();
    this.addContainerToStarfieldGroup();
    // generate stars
    this.createStars();
    // execute the given generator to generate more objects
    this.createSpaceObjects(generator);
    // reorder all space objects by their depth value
    this.sortSpaceObjects();
  }

  /**
   * Sets the map instance
   * @param {object} map - Map
   */
  setMap(map) {
    if (!map) {
      throw new Error('Map instance must be passed as first parameter!');
    }
    this.map = map;
  }

  /**
   * Sets the Phaser.Game instance
   * @param {object} game - Phaser.Game
   */
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

  createSpaceObjects(generatorClass) {
    if (!this.spaceObjects) {
      this.spaceObjects = [];
    }
    if (!generatorClass) return;
    this.generateSpaceObjects(generatorClass);
  }

  generateSpaceObjects(Generator) {
    if (!Generator) return;
    const generatorInstance = new Generator(this);
    generatorInstance.generate();
    generatorInstance
      .getSpaceObjects()
      .forEach(obj => this.spaceObjects.push(obj));
  }

  sortSpaceObjects() {
    this.spaceObjects.sort((a, b) => a.z - b.z);
  }

  createStars() {
    if (!this.spaceObjects) {
      this.spaceObjects = [];
    }
    const starGenerator = new StarGenerator(this);
    starGenerator.generate();
    starGenerator.getSpaceObjects().forEach(obj => this.spaceObjects.push(obj));
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

  /**
   * Returns the game instance
   * @return {object} Phaser.Game instance
   */
  getGame() {
    return this.game;
  }

  /**
   * Returns the singleton Map instance
   * @return {object} Map instance
   */
  getMap() {
    return this.map;
  }

  /**
   * Returns the local cache for sprite objects
   * @return {object} key-value map of Phaser.Sprite references
   */
  getSprites() {
    return sprites;
  }
}

export default DeepSpaceLayer;
