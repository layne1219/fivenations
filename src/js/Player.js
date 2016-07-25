define('Player', ['Util'], function(Util) {

    function Player(config) {
        init.call(this, config);
    }

    function init(config) {
        initDispatcher.call(this);
        setTeamInformation.call(this, config);
        setResources.call(this, config);
    }

    function initDispatcher(){
        this.dispatcher = new Util.EventDispatcher();        
    }

    function setTeamInformation(config){
        this.team = config.team || 1;
        this.user = config.user || false;
    }

    function setResources(config){
        this.setTitanium(config.titanium || 0);
        this.setSilicium(config.silicium || 0);
        this.setEnergy(config.energy || 0);
        this.setUranium(config.Uranium || 0);
    }

    Player.prototype = {

        setTitanium: function(value) {
            if (!value) return;
            this.dispatcher.dispatch('change/titanium', {
                old: this.titanium,
                new: value
            });
            this.titanium = value;
        },

        setSilicium: function(value) {
            if (!value) return;
            this.dispatcher.dispatch('change/silicium', {
                old: this.silicium,
                new: value
            });            
            this.silicium = value;
        },

        setEnergy: function(value) {
            if (!value) return;
            this.dispatcher.dispatch('change/energy', {
                old: this.energy,
                new: value
            });            
            this.energy = value;
        },

        setUranium: function(value) {
            if (!value) return;
            this.dispatcher.dispatch('change/uranium', {
                old: this.uranium,
                new: value
            });            
            this.uranium = value;
        },

        getTitanium: function() {
            return this.titanium;
        },

        getSilicium: function() {
            return this.silicium;
        },

        getEnergy: function() {
            return this.energy;
        },

        getUranium: function() {
            return this.uranium;
        },

        getTeam: function() {
            return this.team;
        },

        isControlledByUser: function() {
            return this.user;
        },

        on: function(evt, func){
            if (!evt) return;
            this.dispatcher.addEventListener(evt, func);
        }

    };

    return Player;

});