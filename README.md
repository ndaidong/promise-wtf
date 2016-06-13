# promise-wtf
Lightweight Promise implementation **w**ith **t**he "**f**inally" method

[![NPM](https://badge.fury.io/js/promise-wtf.svg)](https://badge.fury.io/js/promise-wtf)
![Travis](https://travis-ci.org/ndaidong/promise-wtf.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/promise-wtf/badge.svg?branch=master)](https://coveralls.io/github/ndaidong/promise-wtf?branch=master)
![devDependency Status](https://david-dm.org/ndaidong/promise-wtf.svg)
[![Known Vulnerabilities](https://snyk.io/test/npm/promise-wtf/badge.svg)](https://snyk.io/test/npm/promise-wtf)


## Why

Native Promise in ECMAScript 2015 came without "finally" while this method is really useful in many cases.

For an instance, let's start with the following script:

```
var Article = require('../models/Article');

export var home = (req, res) => {

  let query = req.query || {};
  let skip = query.skip || 0;
  let limit = query.limit || 10;

  let data = {
    error: 0,
    entries: []
  };
```

I don't think that's good to write something like this:

```
  return Article.list(skip, limit).then((result) => {
    data.entries = result;
    res.render('landing', data);
  }).catch((err) => {
    data.error = err;
    res.render('landing', data);
  });
};
```

However, it's better to have "finally" there:

```
  return Article.list(skip, limit).then((result) => {
    data.entries = result;
  }).catch((err) => {
    data.error = err;
  }).finally(() => {
    res.render('landing', data);
  });
};
```

Unfortunately, "finally" is only available in some libraries such as Bluebird, or Q+, those are quite heavy to load for client side usage. What I need is just a basic prototype, a simple polyfill with "finally" implemented.


## What's different

This variant provides the Promise constructor and 4 static methods:

- [Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)
- [Promise.reject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
- [Promise.all](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [Promise.series](https://github.com/ndaidong/promise-wtf/issues/2) (since v0.0.9)



## How

In node.js

```
npm install promise-wtf
```

And then:

```
var fs = require('fs');
var Promise = require('promise-wtf');

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

read('./hello.txt').then((a) => {
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
```

Ouput:
```
Hello
I like Promise
I need finally
Done
```


##### Using SystemJS

```
  System.config({
    baseURL: '/path/to/promise-wtf.js/folder',
    map: {
      promise: 'promise-wtf'
    }
  });

  System.import('promise').then(function(Promise){
    // use Promise here
  });

```

##### Using RequireJS

```
require.config({
  baseUrl: '/path/to/promise-wtf.js/folder',
  paths: {
    promise: 'promise-wtf'
  }
});

requirejs('promise', function(Promise){
  // use Promise here
});

```

#### CDN

[Promise.min.js](https://cdn.rawgit.com/ndaidong/promise-wtf/master/dist/Promise.min.js)


## Test

```
git clone https://github.com/ndaidong/promise-wtf.git
cd promise-wtf
npm install
npm test
```


# License

The MIT License (MIT)
