var website = require('./website.js');
var fs = require("fs");

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

function buildParallel(pathToFile) {
  try {
    var fs = require("fs");
    var content = fs.readFileSync(pathToFile);
    var jsonContent = JSON.parse(content);

    for(var key in jsonContent) {
      var option = jsonContent[key].option;
      var timer = jsonContent[key].timer;
      var type = jsonContent[key].type;
      const t = new website(option, timer,type);
      t.fireRequest();
      t.emit('tick');
    }

  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = {
  buildWebsite,
  buildParallel
};
