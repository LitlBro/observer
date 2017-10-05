var clone = require('clone');
var website = require('./website.js');

function jsonParser(pathToFile) {
  var fs = require("fs");
  var content = fs.readFileSync(pathToFile);
  var jsonContent = JSON.parse(content);

  var option = {method: 'GET'};
  var objectArray = [];

  for(var key in jsonContent) {
    let tmp = clone(option);
    tmp.host = jsonContent[key].adress;
    let color = jsonContent[key].color;
    let timer = jsonContent[key].timer;
    let t = new website(tmp, color,timer);
    objectArray.push(clone(t));

  }


    return objectArray;
}

module.exports = {jsonParser};
