'use strict';
const assert = require('chai').assert;
const server = require('./lib/test-server.js');
const connector = require('./lib/phantomjs-connector.js');

server.start();
connector.on('exit', server.stop.bind(server));

connector
    .connect(server.getURL())
    .then(status => {

        describe('Server application', function() {

            it('Application should return 200', function() {
                assert.equal(status, 'success');
            });

        });

        run();

    })
    .then(connector.exit.bind(connector))
    .catch(ex => {
        console.error(ex);
    });
