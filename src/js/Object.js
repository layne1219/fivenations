define('Object', ['ObjectManager'], function(ObjectManager){
	
	var uid = 0,
		shape;

	function Object(id){
		if (id <= 0){
			throw 'Invalid ID has been passed!';
		}
		
	}

	Object.prototype = {

	}

	return Object;

});

