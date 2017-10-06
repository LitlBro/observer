var stream = require('./configHandler.js');
var async = require('async');


var objectArray = stream.jsonParser(process.argv[2]);



/*var functionArray = [];
for (var ob of objectArray) {
  functionArray.push(ob.fireRequest.bind(ob));
}*/
objectArray.map(object => {object.fireRequest()});

  /*functionArray.push(ob.fireRequest.bind(ob));
  //functionArray.push(x => ob.fireRequest());
}
//TODO get rid of that ! (go to event driven)

function runRequest() {
  async.parallel(
      functionArray,
      function(err, results) {})/*,
      setTimeout(runRequest, 2000)
};


setImmediate(runRequest)
*/
function display(obj) {
  console.log(obj.history.getAll());
}

setTimeout(display, 10000, objectArray[0]);
setTimeout(display, 10000, objectArray[1]);
