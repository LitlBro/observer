const http = require('http');
const https = require('https');
const EventEmitter = require('events');
const container = require("./container.js");
//TODO : compute metrics
//TODO : if not http, try https
 const Website = class extends EventEmitter {
  constructor(opt, timer = 2, color = '\x1b[33m', type = 'http') {
    super();
    this.option = opt; //URL of host, method and other
    this.color = color; //Color display in terminal
    this.clock = timer; //timer (2 or 10min)
    this.history = new container(Math.round(60/timer)+1); //an Hour divided by minute interval between check
    this.getter = (type=='http') ? http : https;
    this.tick = 0;

    this.on("tick", () => {
      this.tick = this.tick + 10;
      this.checkTimeFrame();
      setTimeout(()=>{this.emit('tick')},1*1000)
    });
  }
  checkTimeFrame() {
    if(this.tick%60==0) {
      this.displayInfo(this.history.getAll());
    } else {
      this.displayInfo(this.history.getHistory(Math.round(10/this.clock)+1));
    }
    if(this.tick == (this.clock*60)) {
        this.fireRequest();
        this.tick = 0;
    }
  }
  displayInfo(data) {
    console.log(this.AvgResponseTime(data));
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
    this.getter.request(opt, res => {
      var delay = new Date() - start;
      this.addRes(res, start, delay);
      var to = (this.getter==https) + " request : " + opt.host + " at date " + res.headers.date ;
      var from = "returned : " + res.statusCode + " and took = " + delay + " ms"
      console.log(this.color + "\n\n" + to + "\n" + from);
      this.emit('rcv',opt.host);

      console.log("pool : " + this.history.getSize() + "/" + this.history.size);

    }).on('error', err => {
      console.log("ERROR : an error had occured for host" + this.option.host);
      var delay = new Date() - start;
      this.addRes(null, start, delay,err);
      //this.emit('rcv',opt.host);

    }).end();

  }
  AvgResponseTime(data) {

    var validTime = 0;
    var failedTime = 0;
    var validRequest = 0;
    var failedRequest = 0;
    data.map(element => {
      if(element.available) {
        validRequest++;
        validTime = validTime + element.delay;
      }
      else {
        failedRequest++;
        failedTime = failedTime + element.delay;
      }
    })

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
