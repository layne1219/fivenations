const scripts = {};
let singleton;

class Scriptbox {
    
    add(key, script) {
        scripts[key] = script;
    }

    run(key) {
        if (!scripts[key] ) return;
        scripts[key]();
    }

    has(key) {
        return !!scripts[key];
    }

}

export default {

    getInstance: function() {
        if (!singleton) {
            singleton = new Scriptbox();
        }
        return singleton;
    }

};
