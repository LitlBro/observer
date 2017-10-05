var stream = require('./dataStreamer.js');
var async = require('async');


var objectArray = stream.jsonParser(process.argv[2]);



var functionArray = [];
for(var ob of objectArray) {
  functionArray.push(ob.fireRequest.bind(ob));
  //functionArray.push(x => ob.fireRequest());
}
//TODO get rid of that ! (go to event)
function runRequest() {
  async.parallel(
    functionArray,
    function(err, results) {
    }),
  setTimeout(runRequest, 10*1000,null)
};


process.on('uncaughtException', (err) => {
  console.error("ERROR :\t" + err + "\n");
  process.exit(1);
});

runRequest();
