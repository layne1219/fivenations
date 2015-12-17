define('DataObject', function(){

	function DataObject(json){

		var data = Object.create(json);

		// setting up entity data attributes
		data.maxhull = data.hull;
		data.maxshield = data.shield;
		data.maxpower = data.power;

		// for providing privacy for the data variables we have to create a closure here so as not to
		// publish any data variable held by the entity
		return {

			getId: function(){
				return data.id;
			},

			getName: function(){
				return data.name;
			},		

			getType: function(){
				return data.type;
			},

			getMaxHull: function(){
				return data.hull;
			},				

			getMaxShield: function(){
				return data.shield;
			},	

			getMaxPower: function(){
				return data.power;
			},

			getHull: function(){
				return data.hull;
			},				

			getShield: function(){
				return data.shield;
			},	

			getPower: function(){
				return data.power;
			},

			getArmor: function(){
				return data.armor;
			},				

			getHangar: function(){
				return data.hangar;
			},				

			getSpeed: function(){
				return data.speed;
			},

			getManeuverability: function(){
				return data.maneuverability;
			},		

			getVision: function(){
				return data.vision;
			},

			getWeapons: function(){
				return data.weapons;
			},				

			getTitanium: function(){
				return data.titanium;
			},

			getSilicium: function(){
				return data.silicium;
			},		

			getPower: function(){
				return data.power;
			},

			getEnergy: function(){
				return data.energy;
			},

			getUranium: function(){
				return data.uranium;
			},

			getSpace: function(){
				return data.space;
			},		

			getBuildingTime: function(){
				return data.buildingTime;
			},

			getDirections: function(){
				return data.directions;
			},		

			getAnimFrame: function(){
				return data.animFrame;
			},

			getAnimType: function(){
				return data.animType;
			},		

			getWidth: function(){
				return data.dimensions.width;
			},

			getHeight: function(){
				return data.dimensions.height;
			}		
		};
	}

	return DataObject;

});