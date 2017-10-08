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
    this.availability = 100;
    this.warning = false;
    this.on("tick", () => {
      console.log("tick : " +this.tick);
      if(this.tick%(60*this.clock) == 0) {
        this.getContent()
        .then(() => {
          this.checkTimeFrame();
          this.tick = 0;
          this.setTick();
        });

      } else {
        this.checkTimeFrame();
        this.setTick();
      }

    });
  }

  setTick() {
    this.tick = this.tick + 10;
    setTimeout(()=>{this.emit('tick')},2*1000);
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

  checkTimeFrame() {
    var tmp = this.tick;
    if(tmp%120==0) {
      this.checkAvailability(this.history.getAll());
    }
    if(tmp%60==0) {
      this.displayInfo(this.history.getAll());
    } else {
      this.displayInfo(this.history.getHistory(Math.round(10/this.clock)+1));
    }

  }

  getContent() {
    var opt = this.option;
    var start = new Date();
    return new Promise((resolve, reject) => {

     this.getter.request(opt, res => {
          var delay = new Date() - start;
          this.addRes(res, start, delay);
          resolve();
        }).on('error', err => {
          var delay = new Date() - start;
          this.addRes(null, start, delay,err);
          console.log("ERROR : host ( "+ this.option.host +" ) cannot be reached");
          resolve();
        }).end();
      });
   }

  displayInfo(data) {
    if(Object.keys(data).length > 0) {
      var st = "Metrics for host : " + this.option.host;

      var res = this.responseTime(data);
      var status = this.responseStatus(data);
      var vbt = this.availability;

      st = st + "\n response time : max = " + res.max + ", min = " + res.min + ", avg = " + res.avg;
      st = st + "\n status code count = " + JSON.stringify(status);
      st = st + "\n website availability = " + vbt
      st = st + "\n";
      console.log(st);
    }
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
      "min":minTime,
      "avg":avg,
      "max":maxTime
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

  checkAvailability(data) {
    if(data.length > 0) {
      var downTime = 0;
      var upTime = 0;
      var date = data[0].date;
      data.map(element => {
          ("failure" == element.status) ? (++downTime): (++upTime);
      });
      var availability = Math.round((upTime/(upTime + downTime)) * 100);
      if(this.availability < 80 && availability < 80 && !this.warning ) {
        this.warning = true;
        console.log("\x1b[31m" + this.option.host + " availability is below 80% for too long, at "+ date +"\x1b[37m");
      }
      if(this.availability < 80 && availability >= 80) {
        this.warning = false;
        console.log("\x1b[32m " + this.option.host + "  availability is now above 80, at "+ date +"\x1b[37m");
      }
      this.availability = availability;
    }

  }
}
module.exports = Website;
