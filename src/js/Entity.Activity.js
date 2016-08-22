define('Entity.Activity', function() {

    function Activity() {}

    Activity.prototype = {

        active: false,
        initialised: false,
        manager: null,

        update: function() {
        },

        activate: function() {
            this.active = true;
        },

        deactivate: function() {
            this.active = false;
        },

        kill: function() {
            this.manager.remove(this);
        },

        setId: function(id) {
            this.id = id;
        },

        setManager: function(manager) {
            if (!manager) {
                throw 'The passed Activity Manager object is invalid!';
            }
            this.manager = manager;
        },

        isActivated: function() {
            return this.active;
        },

        getId: function(id) {
            return id;
        }

    };

    return Activity;

});