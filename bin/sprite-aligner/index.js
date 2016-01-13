#! /usr/bin/env node
var jf = require('jsonfile'),
	atlasJSON = process.argv[2],
	width = process.argv[3] || 300,
	height = process.argv[4] || 300;

// asynchronous version
jf.readFile(atlasJSON, function(err, obj) {
	
	var minOffsetX = 9999,
		minOffsetY = 9999;

	if (err){
		console.error(err);
	}
	if (!obj.frames){
		console.error('Invalid data structure!');
	}

 	obj.frames.forEach(function(frame){
 		minOffsetX = Math.min(minOffsetX, frame.spriteSourceSize.x);
 		minOffsetY = Math.min(minOffsetY, frame.spriteSourceSize.y);
 	});

 	obj.frames.forEach(function(frame, idx){
 		obj.frames[idx].spriteSourceSize.x -= minOffsetX;
 		obj.frames[idx].spriteSourceSize.y -= minOffsetY; 
 		obj.frames[idx].sourceSize.w = width;
 		obj.frames[idx].sourceSize.h = height;
 		obj.frames[idx].trimmed = false;		
 	});

 	console.log(JSON.stringify(obj));

});