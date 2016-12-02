define('Player', ['Util'], function(Util) {

    var ns = window.fivenations;

    function Player(config) {
        init.call(this, config);
    }

    function init(config) {
        initDispatcher.call(this);
        setGUID.call(this, config);
        setName.call(this, config);
        setTeamInformation.call(this, config);
        setResources.call(this, config);
    }

    function initDispatcher(){
        this.dispatcher = new Util.EventDispatcher();        
    }

    function setGUID(config) {
        this.guid = config.guid;
    }

    function setName(config){
        this.name = config.name;
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

        on: function(evt, func){
            if (!evt) return;
            this.dispatcher.addEventListener(evt, func);
        },

        flush: function(){
            this.setTitanium(this.getTitanium());
            this.setSilicium(this.getTitanium());
            this.setEnergy(this.getTitanium());
            this.setUranium(this.getTitanium());
        },

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

        getCurrentEntityNumber: function() {
            var entityManager = ns.game.entityManager;
            return entityManager.entities(function(entity) {
                return entity.isEntityControlledByUser(this);
            }.bind(this)).length;
        },

        getGUID: function() {
            return this.guid;
        },

        isControlledByUser: function() {
            return this.user;
        }

    };

    return Player;

});