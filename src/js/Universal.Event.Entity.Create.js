define('Universal.Event.Entity.Create', ['Universal.Event'], function(Event){
    
    var ns = window.fivenations;

    function UniversalEventEntityCreate(){
        var args = [].slice.call(arguments);
        Event.apply(this, args);
    }

    UniversalEventEntityCreate.prototype = Object.create(Event.prototype);
    UniversalEventEntityCreate.prototype.constructor = UniversalEventEntityCreate;

        /**
         * No-op function to be overwritten in the child objects
         * @param {object} [options] [extendable object that presents event details]
         * @return {void}
         */
    UniversalEventEntityCreate.prototype.execute = function(options){
        if (!options.data){
            return;
        }

    };

    return UniversalEventEntityCreate;

});