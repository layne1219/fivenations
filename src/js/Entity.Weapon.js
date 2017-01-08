define('Entity.Weapon', ['Universal.EventEmitter'], function(EventEmitter) {

    var ns = window.fivenations;
    
    function alterData(_data) {
        var data = Object.create(_data);
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

            EventEmitter.getInstance().synced.effects.add({
                id: this.data.effect,
                emitter: this,
                x: sprite.x,
                y: sprite.y,
                rotation: rotation,
                velocity: !this.data.acceleration && this.data.maxVelocity,
                maxVelocity: this.data.maxVelocity,
                acceleration: this.data.acceleration
            });

            this.freeze(this.data.cooldown);
        },

        recharge: function() {
            if (this.ready) return;

            if (this.freezeTime > 0) {
                this.freezeTime -= 1;
            } else {
                console.log(this.data.effect, this.manager.getEntity().getDataObject().getName());
                this.freezeTime = 0;
                this.ready = true;
            }
        },

        activate: function() {
            this.ready = true;
        },

        freeze: function(time) {
            this.ready = false;
            this.freezeTime = time || 0;
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