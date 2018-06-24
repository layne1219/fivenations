/* eslint class-methods-use-this: 0 */
const scripts = {};

class CallbackPool {
  /**
   * Adds a script manually to the collection by the given key
   * @param {string} key
   * @param {function} script
   */
  add(key, script) {
    scripts[key] = script;
  }

  /**
   * Executes the registered callback by the given key
   * @param {string} key
   */
  run(key, ...args) {
    if (!scripts[key]) return;
    scripts[key].apply(null, args);
  }

  /**
   * Returns true if a callback is registered with the given key
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return !!scripts[key];
  }
}

export default CallbackPool;
