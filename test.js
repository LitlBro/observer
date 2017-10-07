var clone = require('clone');
var website = require('./website.js');
var pathToFile = process.argv[2]


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
