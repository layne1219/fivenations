define('Entity.Weapon', function() {
	
	function Weapon(data) {
		this.data = data;
	}

	Weapon.prototype = {

		target: null,

		setTarget: function(entity) {
			this.target = entity;
		},

		clearTarget: function() {
			this.target = null;
		},

		getId: function() {
			return this.data.id;
		},		

		getName: function() {
			return this.data.name;
		},

		getDamage: function() {
			return this.data.damage;
		},

		getDamageShield: function() {
			return this.data.damage_shield;
		},

		getRange: function() {
			return this.data.range;			
		},

		getUpgradeLevel: function() {
			return this.data.upgrade_level;
		},

		getTarget: function() {
			return this.target;
		}
	}

	return Weapon;

});