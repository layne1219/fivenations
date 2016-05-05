define('GUI.Activity', function(){
   
    function Activity(){
    }

    Activity.prototype = {

        activate: function(){
            this.active = true;
        },

        deactivate: function(){
            this.active = false;
        },

        isActive: function(){
            return this.active;
        }

    };

    return Activity;

});