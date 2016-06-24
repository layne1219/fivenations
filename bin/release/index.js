var express = require('express');
var fs = require('fs');
var exec = require('child_process').exec;
var app = express();
var port = 8899;
var branch = 'master';

// Polyfill for Fetch API
// https://github.com/matthew-andrews/isomorphic-fetch
require('es6-promise').polyfill();
require('isomorphic-fetch');

function build(){
    var command = 'gulp build';
    var options = {
        cwd: '../../'
    };
    return new Promise( function(resolve, reject) {
        var build = exec(command, options, function(err) {
            if (err) throw err;
            resolve();
        });

        build.stdout.pipe(fs.createWriteStream('access.log', { flags: 'a'}));
        build.stderr.pipe(fs.createWriteStream('error.log', { flags: 'a'}));
    });
}

app.get('/', function(req, res){
    Promise.resolve()
        .then(build)
        .then( function() {
            res.send(branch + ' has been released!');
        })
        .catch( function(err) {
            res.send('An error occured during the release');
        });
});

app.listen(port, function() {
    console.log('Release script listening on port' + port);
});
