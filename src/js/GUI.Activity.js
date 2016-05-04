define('GUI.Activity', function(){
   
    function Activity(id){
        this.init(id);
    }

    Activity.prototype = {

        init: function(id){
            this.id = id;
        }

    };

    return Activity;

});