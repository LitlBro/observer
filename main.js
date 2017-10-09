// main entry point of the program
var stream = require('./jsonParser.js');

try {
  stream.buildWebsite(process.argv[2]);
} catch (e) {
  console.log(e);
  process.exit(1);
}
