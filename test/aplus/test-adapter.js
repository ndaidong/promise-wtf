var Promise = require('../../src/main');

var defer = () => {
  var deferred = {};

  deferred.promise = new Promise((res, rej) => {
    deferred.resolve = res;
    deferred.reject = rej;
  });

  return deferred;
};

module.exports = {
  resolved: (a) => { return Promise.resolve(a); },
  rejected: (a) => { return Promise.reject(a); },
  deferred: defer,
  Promise: Promise
};
