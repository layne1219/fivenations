define('Entity.Weapon', ['EffectManager'], function(EffectManager) {

    var ns = window.fivenations;
    
    function alterData(data) {
        data.range *= 10;
        return data;
    }

    function Weapon(data) {
        this.data = alterData(data);
        this.ready = true;
    }

    Weapon.prototype = {

        target: null,
        manager: null,

        fire: function(targetEntity) {

            var targetSprite = targetEntity.getSprite();
            var entity = this.manager.getEntity();
            var sprite = entity.getSprite();
            var rotation =  ns.game.game.physics.arcade.angleBetween(sprite, targetSprite);

            this.ready = false;

            EffectManager.getInstance().add({
                id: this.data.effect,
                emitter: this,
                x: sprite.x,
                y: sprite.y,
                rotation: rotation,
                velocity: !this.data.acceleration && this.data.maxVelocity,
                maxVelocity: this.data.maxVelocity,
                acceleration: this.data.acceleration
            });         
        },

        recharge: function() {
            this.ready = true;
        },

        activate: function() {
            this.ready = true;
        },

        deactivate: function() {
            this.ready = false;
        },

        setManager: function(manager) {
            if (!manager) throw 'Invalid WeaponManager is passed!';
            this.manager = manager;
        },

        setTarget: function(entity) {
            this.target = entity;
        },

        clearTarget: function() {
            this.target = null;
        },

        getId: function() {
            return this.data.id;
        },

        getManager: function() {
            return this.manager;
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
        },

        isReady: function() {
            return this.ready;
        }

    }

    return Weapon;

});