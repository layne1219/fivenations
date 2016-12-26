define('Entity.Weapon', ['EffectManager'], function(EffectManager) {

    var guid = 0;
    var ns = window.fivenations;
    
    function Weapon(data) {
        this.data = data;
        this.ready = false;
        guid += 1;
        this.guid = guid;
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
                id: 'laser-beam-1',
                x: sprite.x,
                y: sprite.y,
                rotation: rotation,
                velocity: 200
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

        getGUID: function() {
            return this.guid;
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
        },

        isReady: function() {
            return this.ready;
        }

    }

    return Weapon;

});