define('Universal.EventFactory', [
    'Universal.Event.Entity.Move'
], function(UniversalEventEntityMove){
    var events = {
        'entity/move': UniversalEventEntityMove
    };

    return {

        getById: function(id){
            if (!id){
                throw 'ID has not been passed to fetch the Event!';
            }
            if (!events[id]){
                throw 'There is no event registered to the given ID!';
            }
            return events[id];
        }

    }

});