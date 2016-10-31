define('Starfield.SpaceObjectGenerator', function() {

    function SpaceObjectGenerator(deepSpaceLayer) {
        this.deepSpaceLayer = deepSpaceLayer;
    }

    SpaceObjectGenerator.prototype = {
        
        objects: [],
        
        getSpaceObjects: function() {

            this.objects.sort(function(a, b) {
                return b.z - a.z;
            });

            return this.objects;
        },

        addSpaceObject: function(obj) {
            if (!obj) throw 'Invalid SpaceObject was given!';
            this.objects.push(obj);
        }

    };

    return SpaceObjectGenerator;

});
