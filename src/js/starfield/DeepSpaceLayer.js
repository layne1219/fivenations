/* global window */
/* eslint class-methods-use-this: 0 */
import Graphics from '../common/Graphics';

const ns = window.fivenations;
let sprites;

class DeepSpaceLayer {
  constructor(map, generator) {
    this.setMap(map);
    this.setGame(map.getGame());
    this.createTexture();
    this.createContainer();
    this.addContainerToStarfieldGroup();
    this.createSprites();
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

  createSprites() {
    if (sprites) return;
    sprites = {
      cloud1: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-1'),
      cloud2: this.game.make.sprite(0, 0, 'starfield.clouds.bg.type-2'),
      meteorites: this.game.make.sprite(0, 0, 'starfield.meteorites'),
      planet1: this.game.make.sprite(0, 0, 'starfield.planets.type-1'),
      planet2: this.game.make.sprite(0, 0, 'starfield.planets.type-2'),
    };
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

  add(spaceObject) {
    if (!(spaceObject instanceof spaceObject)) {
      throw new Error();
    }
    this.spaceObjects.push(spaceObject);
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
