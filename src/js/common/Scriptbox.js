/* eslint class-methods-use-this: 0 */
const scripts = {};
let singleton;

class Scriptbox {
  add(key, script) {
    scripts[key] = script;
  }

  run(key, ...args) {
    if (!scripts[key]) return;
    scripts[key].apply(null, args);
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
