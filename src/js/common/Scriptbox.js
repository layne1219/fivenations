const scripts = {};
let singleton;

class Scriptbox {
  add(key, script) {
    scripts[key] = script;
  }

  run(key) {
    if (!scripts[key]) return;
    const params = [].slice.call(arguments, 1);
    scripts[key].apply(null, params);
  }

  has(key) {
    return !!scripts[key];
  }
}

export default {
  getInstance() {
    if (!singleton) {
      singleton = new Scriptbox();
    }
    return singleton;
  },
};
