const http = require('http');
const https = require('https');
const EventEmitter = require('events');
const container = require("./container.js");
const Website = class extends EventEmitter {
  constructor(opt, timer = 2, type = 'http') {
    super();
    this.option = opt; //URL of host, method and other
    this.clock = timer; //timer (2 or 10min)
    this.history = new container(Math.round(60/timer)+1); //an Hour divided by minute interval between check
    this.getter = (type=='http') ? http : https;
    this.tick = 0;

    this.on("tick", () => {
      this.tick = this.tick + 10;
      this.checkTimeFrame();
      setTimeout(()=>{this.emit('tick')},5*1000)
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
    if(Object.keys(data).length > 0) {
      console.log("data for host :" + this.option.host);
      console.log(this.responseTime(data));
      console.log(this.responseStatus(data));
    }
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
    var start = new Date();
    this.getter.request(opt, res => {
      var delay = new Date() - start;
      this.addRes(res, start, delay);
      this.emit('rcv',opt.host);
    }).on('error', err => {
      console.log("ERROR : an error had occured for host" + this.option.host);
      var delay = new Date() - start;
      this.addRes(null, start, delay,err);
      //this.emit('rcv',opt.host);

    }).end();

  }
  responseTime(data) {

    var avgTime = 0;
    var nbRequest = 0;
    var maxTime = 0;
    var minTime = Number.MAX_VALUE;

    data.map(element => {
        nbRequest++;
        avgTime = avgTime + element.delay;
        maxTime = (maxTime >= element.delay) ? maxTime : element.delay;
        minTime = (minTime <= element.delay) ? minTime : element.delay;
    });

    var avg = (nbRequest==0) ? "none" : Math.round(avgTime/nbRequest);
    return {
      "Min":minTime,
      "Avg":avg,
      "Max":maxTime
    };
  }
  responseStatus(data) {
    var allStatus = {};
    data.map(element => {
      if(allStatus[element.status]) {
        allStatus[element.status] ++;
      } else {
        allStatus[element.status] = 1
      }
    });
    return allStatus;
  }

}
module.exports = Website;
