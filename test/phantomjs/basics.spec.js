'use strict';
const phantom = require('phantom');
const rootDir = '../../';
const server = require(rootDir + 'server.js');
const port = 9001;
const addr = 'http://localhost:' + port;
let phInstance = null;

function beforePhantomJS() {
    server.start(port, rootDir + 'dist');
}

function exit(exitCode) {
    server.stop();
    phInstance.exit(exitCode);
}

beforePhantomJS();

phantom
    .create()
    .then(instance => {
        console.log('Phantom JS instance is spawned');
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        console.log(`Opening ${addr}...`);
        return page.open(addr);
    })
    .then(status => {
        if (status !== 'success') {
            throw 'Invalid status code!';
        } else {
            console.log('Server is heathly!');
            console.log('Tearing down...');
            exit();
        }
    })
    .catch(error => {
        console.log(error);
        exit(1);
    });
