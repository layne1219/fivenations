var argv = require('minimist')(process.argv.slice(2));
var server = require('./server.js');

var port = argv.p || 9000;
var dir = argv.d || 'dist/';

server.start(port, dir);
