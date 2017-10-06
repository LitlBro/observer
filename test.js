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
  var t = new website(option, color,timer);
  //console.log('test');
  t.on("rcv", (data) => {
    console.log(t.history.getAll());
    function run() {t.fireRequest()};
    var time = t.timer*1000;
    setTimeout(run, 2000);
    //console.log("timer is : " + time + " for => " + data + "\n Is =>" + this.option.host);
  });

  t.fireRequest();
}
