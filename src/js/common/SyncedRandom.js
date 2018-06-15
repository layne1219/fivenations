/* global window */
/* eslint class-methods-use-this: 0 */
const ns = window.fivenations;
let singleton;

/**
 * Generates random number
 * @return {object} array of random numbers
 */
function getDefaultRandomNumbers() {
  const numbers = [];
  for (let i = 0; i < 250; i += 1) {
    numbers.push(Math.random());
  }
  return numbers;
}

// default list of random numbers
let list = getDefaultRandomNumbers();

class SyncedRandom {
  constructor() {
    this.game = ns.game.game;
  }

  /**
   * Initialises the synced random generator
   * @param {object} numbers - array of randomly generated numbers between 0-1
   */
  setRandomNumbers(numbers) {
    list = numbers;
  }

  /**
   * Returns a randomly generated number from the list based on the current time
   * @return {number}
   */
  get() {
    const idx = this.game.time.time % list.length;
    return list[idx];
  }

  /**
   * Returns the whole list of the synvced random numbers
   * @return {object} array of numbers
   */
  getAll() {
    return list;
  }
}

export default {
  /**
   * Returns singleton instance of SyncedRandom
   * @return {object}
   */
  getInstance() {
    if (!singleton) {
      singleton = new SyncedRandom();
    }
    return singleton;
  },
};
