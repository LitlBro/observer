/**
 * Is going to contain the data for an observer
 * Is circular to create 0(1) insert (no deletion but overwrite)
 **/
class Container {
  constructor(size) {
    this.size = size;
    this.pool = [];
    this.index = 0;
  }

  empty() {
    return (this.pool.length == 0);
  }

  grow() {
    this.index = (this.index + 1) % this.size;
  }

  //insert and grow, index is the next value to be assigned
  insert(val) {
    this.pool[this.index] = val;
    this.grow();
  }

  // return the current size of data, maximum is this.size
  getSize() {
    if (typeof this.pool[this.size - 1] === 'undefined') {
      return this.index;
    } else {
      return this.size;
    }
  }

  //return value (undefined if not present)
  getVal(i) {
    return this.pool[i];
  }

  //return the whole pool of data
  getAll() {
    return this.pool;
  }

  // return the n last entry
  //allow to build array of data over a shorter/closer period of time
  getHistory(regressiveIndex) {
    if (regressiveIndex <= 0) return null;
    if (regressiveIndex >= this.getSize()) {
      return this.pool;
    } else {
      var tmp = this.index;
      var history = [];
      var historyIndex;
      for (var i = 1; i <= regressiveIndex; i++) {
        historyIndex = this.index - i;
        if (historyIndex < 0) historyIndex = historyIndex + this.getSize();
        history.push(this.getVal(historyIndex));
      }
      return history;
    }
  }
}


module.exports = Container;
