var promisesAplusTests = require("promises-aplus-tests");
var adapter = require('./test-adapter');
promisesAplusTests(adapter, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('All done');
  }
});
