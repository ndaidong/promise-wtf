/**
 * promise-wtf
 * v1.2.2
 * built: Fri, 18 Nov 2016 08:26:17 GMT
 * git: https://github.com/ndaidong/promise-wtf
 * author: @ndaidong
 * License: MIT
**/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function (name, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    var root = window || {};
    if (root.define && root.define.amd) {
      root.define([], factory);
    } else if (root.exports) {
      root.exports = factory();
    } else {
      root[name] = factory();
    }
  }
})('Promise', function () {

  var ENV = typeof module !== 'undefined' && module.exports ? 'node' : 'browser';

  var PENDING = 0;
  var REJECTED = 1;
  var RESOLVED = 2;

  var isFunction = function isFunction(v) {
    return v && {}.toString.call(v) === '[object Function]';
  };

  var P = function () {
    function P(fn) {
      _classCallCheck(this, P);

      var _state = PENDING;
      var _deferred = null;
      var _value = void 0;

      var self = this;

      var handle = function handle(instance) {

        if (_state === PENDING) {
          _deferred = instance;
          return false;
        }

        var cb = _state === RESOLVED ? instance.onResolved : instance.onRejected;

        if (!cb) {
          return _state === RESOLVED ? instance.resolve(_value) : instance.reject(_value);
        }

        return instance.resolve(cb(_value));
      };

      var reject = function reject(reason) {
        _state = REJECTED;
        _value = reason;

        if (_deferred) {
          handle(_deferred);
        }
      };

      var resolve = function resolve(instance) {
        if (instance && isFunction(instance.then)) {
          instance.then(resolve, reject);
          return;
        }
        _state = RESOLVED;
        _value = instance;

        if (_deferred) {
          handle(_deferred);
        }
      };

      self.then = function (onResolved, onRejected) {
        return new P(function (_resolve, _reject) {
          return handle({
            onResolved: onResolved,
            onRejected: onRejected,
            resolve: _resolve,
            reject: _reject
          });
        });
      };

      self['catch'] = function (onRejected) {
        return self.then(null, onRejected);
      };

      return fn(resolve, reject);
    }

    _createClass(P, null, [{
      key: 'resolve',
      value: function resolve(value) {
        return new P(function (resolve) {
          return resolve(value);
        });
      }
    }, {
      key: 'reject',
      value: function reject(value) {
        return new P(function (resolve, reject) {
          return reject(value);
        });
      }
    }, {
      key: 'all',
      value: function all(promises) {

        var results = [];
        var done = P.resolve(null);

        promises.forEach(function (promise) {
          done = done.then(function () {
            return promise;
          }).then(function (value) {
            results.push(value);
          });
        });
        return done.then(function () {
          return results;
        });
      }
    }]);

    return P;
  }();

  var root = ENV === 'node' ? global : window;
  var $P = root.Promise || P;

  $P.prototype['finally'] = function (func) {
    return this.then(function (value) {
      return $P.resolve(func()).then(function () {
        return value;
      });
    });
  };

  $P.series = function (tasks) {
    return new $P(function (resolve, reject) {
      var t = tasks.length;
      var exec = function exec(k) {
        tasks[k](function (err) {
          if (err) {
            return reject(err);
          }
          if (k < t - 1) {
            return exec(k + 1);
          }
          return resolve();
        });
      };
      return exec(0);
    });
  };

  return $P;
});