var website = require('./website.js');
var fs = require("fs");

/**
* input shoudl be an JSON file
* process the JSON file to build website object
* trigger their internal clock by emitting a "tick"
*/
function buildWebsite(pathToFile) {

  try {
    var fs = require("fs");
    var content = fs.readFileSync(pathToFile);
    var jsonContent = JSON.parse(content);
  } catch(error) {
    console.log(error);
    process.exit(1);
  }

  try {
    for(var key in jsonContent) {
      var option = jsonContent[key].option;
      var timer = jsonContent[key].timer;
      var type = jsonContent[key].type;
      const t = new website(option, timer,type);
      t.emit('tick');
    }
  } catch(error) {
    console.log(error);
  }
}

module.exports = buildWebsite
