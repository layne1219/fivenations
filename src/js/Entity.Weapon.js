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
        this.level = 0;
        guid += 1;

        this.onTargetEntityRemove = function() {
            this.clearTargetEntity();
        }.bind(this);
    }

    Weapon.prototype = {

        targetEntity: null,
        manager: null,

        update: function() {
            if (this.isReady()) {
                if (this.hasTargetEntity()) {
                    if (this.isReleasable()) {
                        this.release();
                    }
                } else {
                    this.scan();
                }
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
            // if the weapon has a target already
            if (this.targetEntity) return;

            var targetEntity = this.entity.getClosestHostileEntityInRange();

            // if there is no target nearby
            if (!targetEntity) {
                this.clearTargetEntity();
            } else {

                // if the weapon finds its target independently from the manual select
                if (this.isSelfContained()) {
                    this.setTargetEntity(targetEntity);
                }

                if (this.manager._lastEntityAttacked !== targetEntity) {
                    EventEmitter
                        .getInstance()
                        .synced
                        .entities(this.entity.getGUID())
                        .attack({ targetEntity: targetEntity });
                    this.manager._lastEntityAttacked = targetEntity;
                }
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
                var velocity = this.data.velocity;

                if (!velocity) {
                    velocity = this.data.acceleration || this.data.maxVelocity;
                }

                EventEmitter.getInstance().synced.effects.add({
                    id: this.data.effect,
                    emitter: this,
                    x: sprite.x + Util.rnd(0, 16) - 8,
                    y: sprite.y + Util.rnd(0, 16) - 8,
                    rotation: rotation,
                    velocity: velocity,
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
            this.entityType = this.entity.getDataObject().getType();
            this.unconditionalRelease = this.entityType === 'Fighter' || this.isSelfContained();
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

        getCurrentLevel: function() {
            return this.level;
        },

        getUpgradeLevel: function() {
            return this.data.upgrade_level;
        },

        getTargetEntity: function() {
            return this.targetEntity;
        },

        isSelfContained: function() {
            return this.data.self_contained;  
        },

        isReady: function() {
            return this.ready;
        },

        isReleasable: function() {
            if (this.unconditionalRelease) return true;
            
            // if the entity stands still
            if (this.entity.getMotionManager().movement.velocity !== 0) return false;

            // if the entity doesn't face target entity
            if (this.requiresEntityToFaceTarget()) {
                return this.entity
                            .getMotionManager()
                            .isEntityFacingTargetEntity(this.targetEntity);
            }

            return true;
        },

        hasFriendlyFire: function() {
            return this.data.friendly_fire;
        },

        hasTargetEntity: function() {
            return this.targetEntity;
        },

        requiresEntityToFaceTarget: function() {
            return this.data.requires_entity_to_face_target;
        }

    }

    return Weapon;

});