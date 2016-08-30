var express = require('express');
var argv = require('minimist')(process.argv.slice(2));

var port = argv.p || 9000;
var dir = argv.d || 'dist/';

var app = express();
app.use(express.static(dir));

app.listen(port, function() {
    console.log('Express application is listening on port ' + port);
});
