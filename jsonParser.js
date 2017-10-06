var clone = require('clone');
var website = require('./website.js');
var fs = require("fs");

var pathToFile = process.argv[2];
//TODO check if json or file, if json send directly if file, parse it.
function buildSequential(pathToFile) {
  try {
    var content = fs.readFileSync(pathToFile);
    var jsonContent = JSON.parse(content);


    for(var key in jsonContent) {
      let option = jsonContent[key].option;
      let color = jsonContent[key].color;
      let timer = jsonContent[key].timer;
      const t = new website(option, color,timer);
      t.emit('rcv');
    }
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}

function buildParallel(pathToFile) {
  try {
    var content = fs.readFileSync(pathToFile);
    var jsonContent = JSON.parse(content);


    for(var key in jsonContent) {
      let option = jsonContent[key].option;
      let color = jsonContent[key].color;
      let timer = jsonContent[key].timer;
      const t = new website(option, color,timer);
      t.emit('rcv');
    }
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = {
  buildSequential,
  buildParallel
};
