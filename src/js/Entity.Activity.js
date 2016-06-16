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

        setManager: function(manager) {
            if (!manager) {
                throw 'The passed Activity Manager object is invalid!';
            }
            this.manager = manager;
        },

        kill: function() {
            this.manager.remove(this);
        },

        isActivated: function() {
            return this.active;
        }

    };

    return Activity;

});