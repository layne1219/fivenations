define('Universal.EventFactory', [
    'Universal.Event.Entity.Move',
    'Universal.Event.Entity.Patrol',
    'Universal.Event.Entity.Stop',
    'Universal.Event.Entity.Create',
    'Universal.Event.Entity.Remove',
    'Universal.Event.Entity.Reset',
    'Universal.Event.Entity.Fire',
    'Universal.Event.Entity.Attack',
    'Universal.Event.Entity.Damage',
    'Universal.Event.Player.Create',
    'Universal.Event.Player.Resource.Alter',
    'Universal.Event.Effect.Create',
    'Universal.Event.Effect.Remove'
], function(
    EntityMove, 
    EntityPatrol, 
    EntityStop, 
    EntityCreate, 
    EntityRemove, 
    EntityReset, 
    EntityFire, 
    EntityAttack,
    EntityDamage,
    PlayerCreate, 
    PlayerResoureAlter, 
    EffectCreate,
    EffectRemove
) {

    'use strict';

    var singleton,
        createEventFactory = function() {

            var events = {
                'entity/move': new EntityMove(),
                'entity/patrol': new EntityPatrol(),
                'entity/stop': new EntityStop(),
                'entity/create': new EntityCreate(),
                'entity/remove': new EntityRemove(),
                'entity/reset': new EntityReset(),
                'entity/fire': new EntityFire(),
                'entity/attack': new EntityAttack(),
                'entity/damage': new EntityDamage(),
                'player/create': new PlayerCreate(),
                'player/resource/alter': new PlayerResoureAlter(),
                'effect/create': new EffectCreate(),
                'effect/remove': new EffectRemove()
            };

            return {

                getEventObjectById: function(id) {
                    if (!id) {
                        throw 'ID has not been passed to fetch the Event!';
                    }
                    if (!events[id]) {
                        throw 'There is no event registered to the given ID!';
                    }
                    return events[id];
                }

            }

        };

    return {

        getInstance: function() {
            if (!singleton) {
                singleton = createEventFactory();
            }
            return singleton;

        }

    }


});