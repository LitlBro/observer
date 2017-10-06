var stream = require('./jsonParser.js');

try {
  var mode = process.argv[3]
  if(!mode) {
    stream.buildSequential(process.argv[2]);
  } else if(mode == "parallel") {
    stream.buildParallel(process.argv[2]);

  } else {
    throw "to run sequentially, only give the path to the json file, otherwise specifies <parallel>"
  }

} catch(e) {
  console.log(e);
  process.exit(1);
}
