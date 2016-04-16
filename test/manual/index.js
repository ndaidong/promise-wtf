
/* eslint no-console: 0 */

'use strict';

var fs = require('fs');

var Promise = require('../../src/Promise');

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

read('./test/manual/hello.txt').then((a) => {
  a += 'I like Promise';
  return a;
}).then((b) => {
  b += '\nI need finally';
  return b;
}).then((c) => {
  console.log(c);
}).catch((err) => {
  console.log(err);
}).finally(() => {
  console.log('Done');
});

Promise.all([ read('./test/manual/a.txt'), read('./test/manual/b.txt') ]).then((results) => {
  results.forEach((text) => {
    console.log(text.replace(/\n/, ''));
  });
});
