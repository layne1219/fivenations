define('Starfield.SpaceObjectGenerator', function() {

    function SpaceObjectGenerator(deepSpaceLayer) {
        this.deepSpaceLayer = deepSpaceLayer;
    }

    SpaceObjectGenerator.prototype = {
        
        objects: [],
        
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

    return SpaceObjectGenerator;

});
