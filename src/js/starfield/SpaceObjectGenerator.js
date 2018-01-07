class SpaceObjectGenerator {
  constructor(deepSpaceLayer) {
    this.objects = [];
    this.deepSpaceLayer = deepSpaceLayer;
  }

  addSpaceObject(obj) {
    if (!obj) throw new Error('Invalid SpaceObject was given!');
    this.objects.push(obj);
  }

  getSpaceObjects() {
    this.objects.sort((a, b) => b.z - a.z);
    return this.objects;
  }

  getSprites() {
    return this.deepSpaceLayer.getSprites();
  }

  getMap() {
    return this.deepSpaceLayer.getMap();
  }
}

export default SpaceObjectGenerator;
