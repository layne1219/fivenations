define('Entity', ['EntityManager'], function(ObjectManager){
	
	var uid = 0,
		shape;

	function Entity(id){
		if (id <= 0){
			throw 'Invalid ID has been passed!';
		}
		
	}

	Entity.prototype = {

	}

	return Entity;

});

