define('GUI.Activity', function(){
   
    function Activity(){
    }

    Activity.prototype = {

        activate: function(){
            this.active = true;
        },

        deactive: function(){
            this.active = false;
        },

        isActive: function(){
            return this.active;
        }

    };

    return Activity;

});