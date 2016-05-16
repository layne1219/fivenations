define('Universal.EventFactory', [
    'Universal.Event.Entity.Move'
], function(UniversalEventEntityMove){

    'use strict';    

    var singleton,
        createEventFactory = function(){

            var events = {
                'entity/move': new UniversalEventEntityMove()
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