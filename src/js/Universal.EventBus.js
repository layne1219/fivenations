define('Universal.EventBus', ['Util'], function(Util){
	
    var singleton,
        createEventBus = function() {
            
            var queue = [];

            return {

                execute: function() {
                    while (n = queue.shift()){
                        n.execute();
                    }
                },

                add: function(evt){
                    if (!evt || typeof evt.execute !== 'function'){
                        return;
                    }
                    queue.push(evt);
                },

                remove: function(evt){
                    for (var i = queue.length - 1; i >= 0; i -= 1) {
                        if (queue[i].uid === event.uid){
                            queue.slice(i, 1);
                            return;
                        }
                    }
                },

                reset: function(){
                    queue.splice(0, queue,length);
                }
            }

        };

    return {

        getInstance: function(){
            if (!singleton){
                singleton = createEventBus();
            }
            return singleton;
        }

    }

});