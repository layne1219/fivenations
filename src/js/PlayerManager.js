define('PlayerManager', ['Player'], function(Player){
	
	var players = [],

		singleton = {

			addPlayer: function(config) {
	            players.push( new Player(config) );        			
			},

			getPlayers: function(){
				return players;
			},

			getUser: function(){
				for (var i = players.length - 1; i >= 0; i--) {
					if (players[i].isControlledByUser()){
						return players[i];
					}
				}
				return false;
			},

			getPlayersNumber: function(){
				return players.length;
			}

		};

	return {

		getInstance: function(){
			return singleton;
		}

	};

});