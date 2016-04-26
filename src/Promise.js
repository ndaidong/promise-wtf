/**
 * Promise
 * Lightweight Promise implementation with the 'finally' method
 * @ndaidong
**/

'use strict';

(() => {

  const ENV = typeof module !== 'undefined' && module.exports ? 'node' : 'browser';

  const PENDING = 0;
  const REJECTED = 1;
  const RESOLVED = 2;

  var isFunction = (v) => {
    return v && {}.toString.call(v) === '[object Function]';
  };

  var doNothing = () => {};
  var doItASAP = (f) => {
    return setTimeout(f, 0);
  };

  var _handle, _reject, _resolve;

  _handle = (instance) => {
    return instance;
  };

  _reject = (reason) => {
    return reason;
  };

  _resolve = (promise, value) => {
    return value;
  };

  class P {

    constructor(fn) {

      let self = this;
      self._state = PENDING;
      self._value = null;
      self._queue = [];
      self._promise = null;

      self.then = (onResolved, onRejected) => {
        let p = new P(doNothing);
        handle({
          onResolved: isFunction(onResolved) ? onResolved : null,
          onRejected: isFunction(onRejected) ? onRejected : null,
          promise: p
        });
        return p;
      };

      self['catch'] = (onRejected) => { // eslint-disable-line dot-notation
        if (onRejected && isFunction(onRejected)) {
          self.then(null, onRejected);
        }
      };

      self['finally'] = (func) => { // eslint-disable-line dot-notation
        if (func && isFunction(func)) {
          self.then(func);
        }
      };

      try {
        return _handle(self.then);
      } catch (e) {
        return _reject(e);
      }
    }

    static resolve(value) {
      let p = P.resolve(doNothing);
      return _resolve(p, value);
    }

    static reject(reason) {
      let p = P.resolve(doNothing);
      return _reject(p, reason);
    }

    static all(promises) {

      let results = [];
      let done = P.resolve(doNothing);

      promises.forEach((promise) => {
        done = done.then(() => {
          return promise;
        }).then((value) => {
          results.push(value);
        });
      });
      return done.then(() => {
        return results;
      });
    }

    static series(tasks) {
      return new P((resolve, reject) => {
        let exec, check;
        let k = 0, t = tasks.length;

        exec = (err) => {
          if (err) {
            return reject(err);
          }
          return check();
        };

        check = () => {
          k++;
          if (k <= t) {
            let f = tasks[k - 1];
            return f(exec);
          }
          return resolve();
        };

        return check();

      });
    }
  }


  // exports
  if (ENV === 'node') {
    module.exports = P;
  } else {
    let root = window || {};
    if (root.define && root.define.amd) {
      root.define(() => {
        return P;
      });
    }
    root.Promise = P;
  }
})();
