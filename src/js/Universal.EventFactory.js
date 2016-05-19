define('Universal.EventFactory', [
    'Universal.Event.Entity.Move',
    'Universal.Event.Entity.Patrol',
    'Universal.Event.Entity.Stop'
], function(UniversalEventEntityMove){

    'use strict';

    // some change here

    var singleton,
        createEventFactory = function(){

            var events = {
                'entity/move': new UniversalEventEntityMove(),
                'entity/patrol': new UniversalEventEntityPatrol(),
                'entity/stop': new UniversalEventEntityStop()
            };

            return {

                getEventObjectById: function(id){
                    if (!id){
                        throw 'ID has not been passed to fetch the Event!';
                    }
                    if (!events[id]){
                        throw 'There is no event registered to the given ID!';
                    }
                    return events[id];
                }

            }

        };

    return {

        getInstance: function(){
            if (!singleton){
                singleton = createEventFactory();
            }
            return singleton;

        }

    }


});