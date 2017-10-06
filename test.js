var clone = require('clone');
var website = require('./website.js');
var pathToFile = process.argv[2]


var fs = require("fs");
var content = fs.readFileSync(pathToFile);
var jsonContent = JSON.parse(content);


for(var key in jsonContent) {
  var option = jsonContent[key].option;
  var color = jsonContent[key].color;
  var timer = jsonContent[key].timer;
  const t = new website(option, color,timer);
  // t.on("rcv", () => {
  //   console.log("timer is : " + time + " Is =>" + t.option.host);
  //   console.log(t.history.getAll());
  //
  //   function run() {t.fireRequest()};
  //   var time = t.clock;
  //   setTimeout(run, time);
  // });

  t.emit('rcv');
}
