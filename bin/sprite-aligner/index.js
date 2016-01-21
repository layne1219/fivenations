#! /usr/bin/env node
var jf = require('jsonfile'),
	atlasJSON = process.argv[2],
	width = process.argv[3] || 300,
	height = process.argv[4] || 300;

// asynchronous version
jf.readFile(atlasJSON, function(err, obj) {
	
	var minOffsetX = 9999,
		minOffsetY = 9999,
		frame;

	if (err){
		console.error(err);
	}
	if (!obj.frames){
		console.error('Invalid data structure!');
	}

	for (var key in obj.frames){
		frame = obj.frames[key];
 		minOffsetX = Math.min(minOffsetX, frame.spriteSourceSize.x);
 		minOffsetY = Math.min(minOffsetY, frame.spriteSourceSize.y);		
	}

 	for (var key in obj.frames){
 		frame = obj.frames[key];
 		obj.frames[key].spriteSourceSize.x -= minOffsetX;
 		obj.frames[key].spriteSourceSize.y -= minOffsetY; 
 		obj.frames[key].sourceSize.w = width;
 		obj.frames[key].sourceSize.h = height;
 		obj.frames[key].trimmed = false;		
 	};

 	console.log(JSON.stringify(obj));

});