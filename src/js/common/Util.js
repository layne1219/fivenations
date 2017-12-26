/* eslint no-bitwise: [0] */
/* eslint no-param-reassign: 0 */
export default {
  /**
   * Randomize a number between the passed range
   * @param  {integer} min
   * @param  {integer} max
   * @return {integer}
   */
  rnd(min, max) {
    return Math.floor(Math.random() * max) + min;
  },

  /**
   * between - determine if the passed value is between a certain range
   * @param  {integer} value
   * @param  {integer} min
   * @param  {integer} max
   * @return {integer}
   */
  between(value, min, max) {
    return value >= min && value <= max;
  },

  /**
   * returns whether the given value is numeric or not
   * @param {mixed} val
   */
  isNumeric(val) {
    return Number(parseFloat(val)) === val;
  },

  /**
   * calculateStepTo - Mesasuring how many steps it takes to arrive at
   * the target number by increasing
   * the current index with step
   * @param  {integer} start
   * @param  {integer} target
   * @param  {integer} max
   * @param  {integer} step
   * @return {integer}
   */
  calculateStepTo(start, target, max, step) {
    let stepCount = 0;
    while (start !== target && stepCount < max) {
      start = (start + step) % max;
      if (start < 0) {
        start = max - 1;
      }
      stepCount += 1;
    }
    return stepCount;
  },

  /**
   * getColorFromRatio - Returning green, yellow or red according to
   * the passed ratio
   * @param {float} ratio
   * @param {string} type if equals to 'hex' the result will be formatted into hexadecimals
   * @return {string} the calculated color
   */
  getColorFromRatio(ratio, type) {
    let color = '#00FF00';

    if (ratio < 0.67 && ratio > 0.33) {
      color = '#FFFF6B';
    } else if (ratio < 0.34) {
      color = '#FF0000';
    }

    return type !== 'hex' ? color.replace('#', '0x') : color;
  },

  /**
   * generates GUID
   * @return {string} the recently generated GUID
   */
  getGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  /**
   * generates a matrix by the given dimension
   * @param  {integer} cols
   * @param  {integer} rows
   * @return {object} Array
   */
  matrix(cols, rows) {
    const arr = [];
    for (let i = 0; i < rows; i += 1) {
      const columns = [];
      for (let j = 0; j < cols; j += 1) {
        columns[j] = 0;
      }
      arr[i] = columns;
    }
    return arr;
  },

  /**
   * Calls the given callback at intervals acoording to the given rate
   * @param  {Function} callback
   * @param  {integer}    rate - every n(th) tick at which the callback will be called
   * @param  {object}     ctx - context in which the function is executed
   * @return {Function} Function that checks if the given callback is due to be triggered
   */
  interval(callback, rate, ctx) {
    let counter = rate || 0;
    return (...args) => {
      counter += 1;
      if (counter > rate) {
        counter = 0;
        callback.apply(ctx || null, args);
      }
    };
  },

  /**
   * Calls the given callback at intervals acoording to the given delay
   * @param  {Function} callback
   * @param  {integer}    rate - every n(th) tick at which the callback will be called
   * @param  {object}     ctx - context in which the function is executed
   * @return {Function} Function that checks if the given callback is due to be triggered
   */
  intervalMilliseconds(callback, milliseconds, ctx) {
    let last = new Date().getTime();
    let now;
    return (...args) => {
      now = new Date().getTime();
      if (now - last > milliseconds) {
        callback.apply(ctx || null, args);
      }
      last = now;
    };
  },

  /**
   * Measures the distance between the given entities
   * @param {object} source first entity
   * @param {object} target second entity
   * @return {integer} distance in pixels
   */
  distanceBetween(source, target) {
    const dx = source.sprite.x - target.sprite.x;
    const dy = source.sprite.y - target.sprite.y;

    return Math.sqrt((dx * dx) + (dy * dy));
  },

  /**
   * Measures the distance between the given sprites
   * @param {object} source first entity
   * @param {object} target second entity
   * @return {integer} distance in pixels
   */
  distanceBetweenSprites(source, target) {
    const dx = source.x - target.x;
    const dy = source.y - target.y;

    return Math.sqrt((dx * dx) + (dy * dy));
  },

  /**
   * Measures the distance between the given sprites
   * @param {object} source first entity
   * @param {object} target second entity
   * @return {integer} distance in pixels
   */
  distanceBetweenEntityAndCoords(source, target) {
    const dx = source.sprite.x - target.x;
    const dy = source.sprite.y - target.y;

    return Math.sqrt((dx * dx) + (dy * dy));
  },

  /**
   * Deep clones the given parameter
   * @param {mixed} o
   * @return {mixed} cloned version of o
   */
  deepClone: function deepClone(o) {
    const output = Array.isArray(o) ? [] : {};
    Object.keys(o).forEach(key => {
      let v = o[key];
      output[key] = typeof v === 'object' ? deepClone(v) : v;
    });
    return output;
  },

  // Eventlistener object
  EventDispatcher: (function () {
    // Inharitable event dispatcher object
    function EventDispatcher() {
      this.events = {};
    }

    EventDispatcher.prototype.events = {};
    EventDispatcher.prototype.addEventListener = function (type, listener) {
      if (!this.events[type]) {
        this.events[type] = [];
      }
      this.events[type].push(listener);
      return this;
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
      if (!this.events[type]) {
        return this;
      }
      const index = this.events[type].indexOf(listener);
      if (!this.events[type][index]) {
        return this;
      }
      this.events[type].splice(index, 1);
      return this;
    };
    EventDispatcher.prototype.dispatch = function (type, event) {
      if (!this.events[type]) {
        return;
      }
      for (const i in this.events[type]) {
        if (typeof this.events[type][i] === 'function') {
          this.events[type][i](event);
        } else if (typeof this.events[type][i] === 'object') {
          this.events[type][i][1].call(this.events[type][i][0], event);
        }
      }
    };
    EventDispatcher.prototype.reset = () => {
      this.events = {};
    };

    return EventDispatcher;
  }()),
};
