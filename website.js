const http = require('https');
const EventEmitter = require('events');
const container = require("./container.js");
//TODO : compute metrics

 const Website = class extends EventEmitter {
  constructor(opt, color, timer = 2) {
    super();
    this.option = opt; //URL of host, method and other
    this.color = color; //Color display in terminal
    this.clock = timer*10*1000; //timer (2 or 10min)
    this.history = new container(10); //an Hour divided by minute interval between check


  }

  addRes(res, start, delay,error=null) {
    this.history.insert({
      "status": (res!=null) ? res.statusCode : "failure",
      "delay":delay,
      "available": (res != null),
      "date": start,
      "error":error
    });
  }



  fireRequest() {
    var opt = this.option;
    var color = this.color;
    var start = new Date();
    http.request(opt, res => {
      var delay = new Date() - start;
      this.addRes(res, start, delay);
      var to = "request to target : " + opt.host + " at date " + res.headers.date ;
      var from = "returned : " + res.statusCode + " and took = " + delay + " ms"
      console.log("\n\n" + to + "\n" + from);

      console.log(this.history.getSize());
      this.emit('rcv',opt.host);

      //console.log(this.history.pool);

    }).on('error', err => {
      console.log("ERROR : an error had occured for host" + this.option.host);
      var delay = new Date() - start;
      this.addRes(null, start, delay,err);
      this.emit('rcv',opt.host);

    }).end();

  }
  AvgResponseTime() {

    var validTime = 0;
    var failedTime = 0;
    var validRequest = 0;
    var failedRequest = 0;
    for (var element of this.history.getAll()) {
      if(element.available) {
        validRequest++;
        validTime = validTime + element.delay;
      }
      else {
        failedRequest++;
        failedTime = failedTime + element.delay;
      }
    }
    var validAvg = (validRequest==0) ? "none" : Math.round(validTime/validRequest);
    var failedAvg = (failedRequest==0) ? "none" : Math.round(failedTime/failedRequest);
    var Avg = Math.round((validTime+failedTime)/(failedRequest+validRequest));
    return {
      "validAvg":validAvg,
      "failedAvg":failedAvg,
      "Avg":Avg
    };
  }
}
module.exports = Website;
