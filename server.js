var express = require('express');
var app;
var server;

module.exports = {

    start: function(port, dir) {

        if (app) throw 'Server is already running!';

        if (!port) port = 9000;
        if (!dir) dir = 'dist/';

        app = express();
        app.use(express.static(dir));
        server = app.listen(port, function() {
            console.log('Express application is listening on port ' + port);
        });
    },

    stop: function() {
        if (!server) return;
        server.close();
    }
};
