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

        setManager: function(manager) {
            if (!manager) {
                throw 'The passed Activity Manager object is invalid!';
            }
            this.manager = manager;
        },

        isActivated: function() {
            return this.active;
        },

        getManager: function() {
            return this.manager;
        }

    };

    return Activity;

});