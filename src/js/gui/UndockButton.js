import EventEmitter from '../sync/EventEmitter';

export default {
    activate: function() {
        EventEmitter
            .getInstance()
            .synced
            .entities(':user:selected')
            .reset()
            .undock();
    }
};
