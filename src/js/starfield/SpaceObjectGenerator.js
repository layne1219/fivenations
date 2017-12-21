function SpaceObjectGenerator(deepSpaceLayer) {
  this.deepSpaceLayer = deepSpaceLayer;
  this.objects = [];
}

SpaceObjectGenerator.prototype = {
  generate() {
    // no-op, merely defined to be overwritten
  },

  addSpaceObject(obj) {
    if (!obj) throw 'Invalid SpaceObject was given!';
    this.objects.push(obj);
  },

  getSpaceObjects() {
    this.objects.sort((a, b) => b.z - a.z);

    return this.objects;
  },
};

export default SpaceObjectGenerator;
