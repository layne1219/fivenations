function SpaceObjectGenerator(deepSpaceLayer) {
    this.deepSpaceLayer = deepSpaceLayer;
    this.objects = [];
}

SpaceObjectGenerator.prototype = {
    
    generate: function() {
        // no-op, merely defined to be overwritten 
    },

    addSpaceObject: function(obj) {
        if (!obj) throw 'Invalid SpaceObject was given!';
        this.objects.push(obj);
    },

    getSpaceObjects: function() {

        this.objects.sort(function(a, b) {
            return b.z - a.z;
        });

        return this.objects;
    }

};

export default SpaceObjectGenerator;
