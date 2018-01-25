/* global window */
/* eslint class-methods-use-this: 0 */
import Graphics from '../common/Graphics';

const ns = window.fivenations;
let sprites;

class Foreground {
  constructor(map, generator) {
    this.setMap(map);
    this.setGame(map.getGame());
    this.createTexture();
    this.createContainer();
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
    this.group = Graphics.getInstance().getGroup('starfield-foreground');
    this.group.add(this.container);
  }

  createSprites() {
    if (sprites) return;
    sprites = {
      cloud1: this.game.make.sprite(
        0,
        0,
        'starfield.foregound.foreground.type-1',
      ),
      cloud2: this.game.make.sprite(
        0,
        0,
        'starfield.foregound.foreground.type-2',
      ),
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
    while (this.spaceObjects.length) {
      const spaceObject = this.spaceObjects.pop();
      spaceObject.remove();
    }
    this.group.remove(this.container);
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

export default Foreground;
