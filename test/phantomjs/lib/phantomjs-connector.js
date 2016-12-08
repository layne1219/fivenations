'use strict';
const phantom = require('phantom');
const events = require('events');

let page;
let phInstance = null;
let emitter = new events.EventEmitter();

module.exports = {

    /**
     * Creates a Phantom JS instance and  connects to the given address
     * @param {string} address 
     * @return {Promise} 
     */
    connect(address) {
        return phantom
            .create()
            .then(instance => {
                console.log('Phantom JS instance is spawned');
                phInstance = instance;
                return instance.createPage();
            })
            .then(page_ => {
                console.log(`Opening ${address}...`);
                page = page_;
                return page.open(address);
            })
            .then( status => {
                emitter.emit('connect', status);
                return status;
            });
    },

    /**
     * Closes the PhantomJS session and returns with the given exit code
     * @param {integer} code - Exit code
     * @return {this}
     */
    exit(code) {
        emitter.emit('exit');
        phInstance.exit(code);
        return this;
    },

    /**
     * Registers listener to the given event
     * @param {string} event - event ID
     * @param {listener} function - listener function to be registered
     * @return {this}
     */
    on(event, listener) {
        emitter.on(event, listener);
        return this;
    },

    /**
     * Page instance to execute further PhantomJS commands
     */
    page
  
};
