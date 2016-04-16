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

  function P(fn) {

    let _state = PENDING;
    let _deferred = null;
    let _value;

    let self = this;

    let handle = (instance) => {

      if (_state === PENDING) {
        _deferred = instance;
        return false;
      }

      let cb = _state === RESOLVED ? instance.onResolved : instance.onRejected;

      if (!cb) {
        return _state === RESOLVED ? instance.resolve(_value) : instance.reject(_value);
      }

      return instance.resolve(cb(_value));
    };

    let reject = (reason) => {
      _state = REJECTED;
      _value = reason;

      if (_deferred) {
        handle(_deferred);
      }
    };

    let resolve = (instance) => {
      if (instance && typeof instance.then === 'function') {
        instance.then(resolve, reject);
        return;
      }
      _state = RESOLVED;
      _value = instance;

      if (_deferred) {
        handle(_deferred);
      }
    };

    self.then = (onResolved, onRejected) => {
      return new P((_resolve, _reject) => {
        return handle({
          onResolved: onResolved,
          onRejected: onRejected,
          resolve: _resolve,
          reject: _reject
        });
      });
    };

    self['catch'] = (onRejected) => { // eslint-disable-line dot-notation
      return self.then(null, onRejected);
    };

    self['finally'] = (func) => { // eslint-disable-line dot-notation
      return self.then(func);
    };

    return fn(resolve, reject);
  }

  P.resolve = (value) => {
    return new P((resolve) => {
      return resolve(value);
    });
  };

  P.reject = (value) => {
    return new P((resolve, reject) => {
      return reject(value);
    });
  };

  P.all = (promises) => {

    let results = [];
    let done = P.resolve(null);

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
  };

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
