define('DataObject', function() {

    function DataObject(json) {

        var data = Object.create(json);

        // setting up custom gameplay related data attributes
        data.maxhull = data.hull;
        data.maxshield = data.shield;
        data.maxpower = data.power;
        data.maxhangar = data.hangar;
        data.team = 1;

        // for providing privacy for the data variables we have to create a closure here so as not to
        // publish any data variable held by the entity
        return {

            damageHull: function(value) {
                data.hull = Math.max(data.hull - value, 0);
            },

            setTeam: function(team) {
                data.team = team;
            },

            isBuilding: function() {
                return !!data.building;
            },

            getTeam: function() {
                return data.team;
            },

            getId: function() {
                return data.id;
            },

            getName: function() {
                return data.name;
            },

            getType: function() {
                return data.type;
            },

            getMaxHull: function() {
                return data.maxhull;
            },

            getMaxShield: function() {
                return data.maxshield;
            },

            getMaxPower: function() {
                return data.maxpower;
            },

            getMaxHangar: function() {
                return data.maxhangar;
            },

            getHull: function() {
                return data.hull;
            },

            getShield: function() {
                return data.shield;
            },

            getPower: function() {
                return data.power;
            },

            getArmor: function() {
                return data.armor;
            },

            getHangar: function() {
                return data.hangar;
            },

            getSpeed: function() {
                return data.speed;
            },

            getManeuverability: function() {
                return data.maneuverability;
            },

            getVision: function() {
                return data.vision;
            },

            getWeapons: function() {
                return data.weapons;
            },

            getTitanium: function() {
                return data.titanium;
            },

            getSilicium: function() {
                return data.silicium;
            },

            getEnergy: function() {
                return data.energy;
            },

            getUranium: function() {
                return data.uranium;
            },

            getSpace: function() {
                return data.space;
            },

            getBuildingTime: function() {
                return data.buildingTime;
            },

            getDirections: function() {
                return data.directions;
            },

            getAnimFrame: function() {
                return data.animFrame;
            },

            getAnimType: function() {
                return data.animType;
            },

            getWidth: function() {
                return data.dimensions.width;
            },

            getHeight: function() {
                return data.dimensions.height;
            },

            getAnimations: function() {
                return data.animations;
            },

            getAnimationByKey: function(key) {
                return data.animations[key];
            },

            hasAnimation: function(key) {
                return !!data.animations[key];
            }

        };
    }

    return DataObject;

});