'use strict';
const rootDir = '../../../';
const server = require(rootDir + 'server.js');
const port = 9001;
const addr = 'http://localhost:' + port;

module.exports = {

    start() {
        return server.start(port, `${rootDir}dist`);
    },

    stop() {
        server.stop();
    },

    getURL() {
        return addr;
    }

};
