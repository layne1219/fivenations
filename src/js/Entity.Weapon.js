define('Entity.Weapon', ['Universal.EventEmitter', 'Util'], function(EventEmitter, Util) {

    var ns = window.fivenations;
    var guid = 0;
    
    function alterData(_data) {
        var data = Object.create(_data);
        data.range *= 10;
        return data;
    }

    function Weapon(data) {
        this.data = alterData(data);
        this.ready = true;
        this.guid = guid;
        guid += 1;

        this.onTargetEntityRemove = function() {
            this.clearTargetEntity();
        }.bind(this);
    }

    Weapon.prototype = {

        targetEntity: null,
        manager: null,

        update: function() {
            if (this.ready) {
                this.scan();
                this.release();
            } else {
                this.recharge();
            }
        },

        recharge: function() {
            if (this.freezeTime > 0) {
                this.freezeTime -= 1;
            } else {
                this.freezeTime = 0;
                this.ready = true;
            }
        },

        scan: function() {
            if (this.targetEntity) return;

            var targetEntity = this.entity.getClosestHostileEntityInRange();
            if (!targetEntity) {
                this.clearTargetEntity();
            } else {
                this.setTargetEntity(targetEntity);
            }
        },

        release: function() {
            if (this.targetEntity) {
                this.fire(this.targetEntity);
            }
        },

        fire: function(targetEntity) {

            var targetSprite = targetEntity.getSprite();
            var sprite = this.entity.getSprite();
            var distance = Util.distanceBetweenSprites(sprite, targetSprite);

            if (distance <= this.getRange()) {

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
            this.entity = manager.getEntity();
        },

        setTargetEntity: function(entity) {
            
            if (this.targetEntity) {
                this.targetEntity.off('remove', this.onTargetEntityRemove);
            }

            this.targetEntity = entity;
            this.targetEntity.on('remove', this.onTargetEntityRemove);
        },

        clearTargetEntity: function() {
            this.targetEntity = null;
        },

        getId: function() {
            return this.data.id;
        },

        getGUID: function() {
            return this.guid;
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

        getTargetEntity: function() {
            return this.targetEntity;
        },

        isReady: function() {
            return this.ready;
        }

    }

    return Weapon;

});