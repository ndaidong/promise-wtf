var promisesAplusTests = require('promises-aplus-tests');
var adapter = require('./test-adapter');
promisesAplusTests(adapter, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('All done');
  }
});
