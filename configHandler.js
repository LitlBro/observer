var clone = require('clone');
var website = require('./website.js');

function jsonParser(pathToFile) {
  try {
    var fs = require("fs");
    var content = fs.readFileSync(pathToFile);
    var jsonContent = JSON.parse(content);

    var objectArray = [];

    for(var key in jsonContent) {
      let option = jsonContent[key].option;
      let color = jsonContent[key].color;
      let timer = jsonContent[key].timer;
      let t = new website(option, color,timer);
      //console.log('test');
      t.on("rcv", (data) => {
        //console.log('pas meme test');
        //console.log("ON EVENT : " + t.history.getAll());
        function run() {t.fireRequest()};
        var time = t.timer*1000;
        setTimeout(run, 2000);
        //console.log("timer is : " + time + " for => " + data + "\n Is =>" + this.option.host);
      });
      objectArray.push(clone(t));

    }
      return objectArray;

  } catch(error) {
    console.log(error);
    process.exit(1);
}

}

module.exports = {jsonParser};
