define('Player', function(){

	function Player(config){
		init.call(this, config);
	}

	function init(config){
		// resources
		this.titanium = config.titanium || 0;
		this.silicium = config.silicium || 0; 
		this.energy = config.energy || 0; 
		this.uranium = config.uranium || 0;
		// control attributes
		this.team =  config.team || 1;
		this.user = config.user || false;
	}

	Player.prototype = {

		setTitanium: function(value){
			this.titanium = value;
		},

		setSilicium: function(value){
			this.silicium = value;
		},

		setEnergy: function(value){
			this.energy = value;
		},

		setUranium: function(value){
			this.uranium = value;
		},

		getTitanium: function(){
			return this.titanium;
		},

		getSilicium: function(){
			return this.silicium;
		},

		getEnergy: function(){
			return this.energy;
		},

		getUranium: function(){
			return this.uranium;
		},

		getTeam: function(){
			return this.team;
		},

		isControlledByUser: function(){
			return this.user;
		}

	};

	return Player;

});