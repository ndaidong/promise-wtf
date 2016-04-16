/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/
/* eslint no-console: 0*/

'use strict';

var fs = require('fs');
var path = require('path');
var test = require('tape');

var rootDir = '../../dist/';
var Promise = require(path.join(rootDir, 'Promise.min.js'));

var hasMethod = (ob, m) => {
  return ob[m] && typeof ob[m] === 'function';
};

var read = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, content) => {
      if (err) {
        return reject(err);
      }
      return resolve(content);
    });
  });
};

test('Testing Promise constructor', (assert) => {

  let instance = read('./test/manual/hello.txt');

  assert.ok(hasMethod(instance, 'then'), 'Promise instance must have "then" method');
  assert.ok(hasMethod(instance, 'catch'), 'Promise instance must have "catch" method');
  assert.ok(hasMethod(instance, 'finally'), 'Promise instance must have "finally" method');
  assert.end();
});

test('Testing Promise result after then', (assert) => {

  let instance = read('./test/manual/hello.txt');

  instance.then((s) => {
    assert.deepEquals(s, 'Hello\n', 'It must return content loaded from file');
  }).catch((e) => {
    console.log(e);
  }).finally(() => {
    assert.end();
  });
});

test('Testing Promise result after catch', (assert) => {
  let instance = read('ninonina');
  assert.doesNotThrow(instance.catch, true, 'It must not throw any error');
  assert.end();
});

test('Testing Promise.all', (assert) => {
  var promise = Promise.resolve(3);
  Promise.all([ true, promise ]).then((values) => {
    assert.deepEquals(values, [ true, 3 ], 'It must return [true, 3]');
    assert.end();
  });
});

test('Testing Promise.reject', (assert) => {
  Promise.reject(new Error('fail')).then((data) => {
    assert.deepEquals(data, null, 'Nothing here');
  }, (error) => {
    assert.deepEquals(error, new Error('[Error: fail]'), 'It must return error here');
    assert.end();
  });
});

test('Testing Promise.resolve', (assert) => {
  Promise.resolve('Success').then((value) => {
    assert.deepEquals(value, 'Success', 'It must return "Success"');
  }, (data) => {
    assert.deepEquals(data, null, 'Nothing here');
  });

  var p = Promise.resolve([ 1, 2, 3 ]);
  p.then((v) => {
    assert.deepEquals(v[0], 1, 'It must return 1 here');
  });
  var original = Promise.resolve(true);
  var cast = Promise.resolve(original);
  cast.then((v) => {
    assert.deepEquals(v, true, 'It must return true here');
  });

  assert.end();
});
