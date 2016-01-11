#! /usr/bin/env node
var jf = require('jsonfile');

// asynchronous version
jf.readFile('/path/to/file.json', function(err, obj) {
	if (err){
		console.error(err);
	}
  console.log(obj);
});