import CallbackPool from './CallbackPool';
import '../entities/callbacks/checkAsteroidHull';

let singleton;

/**
 * Returns the name of the given function object
 * @return {string}
 */
function getFnName(fn) {
  const f = typeof fn === 'function';
  const s =
    f &&
    ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^(]+)/));
  return (!f && 'not a function') || ((s && s[1]) || 'anonymous');
}

/**
 * Returns the singleton instance of the CallbackPool
 * @return {object} singleton
 */
function getInstance() {
  if (!singleton) {
    singleton = new CallbackPool();
  }
  return singleton;
}

/**
 * Registers the given function to the pool
 * @param {function} callback
 */
export function install(callback) {
  const key = getFnName(callback);
  const pool = getInstance();
  pool.add(key, callback);
}

export default {
  getInstance,
};
