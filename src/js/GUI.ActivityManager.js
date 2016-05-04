define('GUI.ActivityManager', function(){
   
   var selectedActivity;

   return {

        hasActiveSelection: function(){
            return selectedActivity !== null;
        }

        getSelectedActivity: function(){
            return selectedActivity;
        }

   };

});