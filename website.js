const http = require('http');
const https = require('https');
const EventEmitter = require('events');
const container = require("./container.js");
const prompt = require('./logger.js')

/**
* class Website
* used to gather, store and compute metrics
* use a external logger made using blessed
* use a external class for storing data
**/

const Website = class extends EventEmitter {

  constructor(opt, timer = 2, type = 'http') {
    super();
    // opt : contains information used to check website
    this.option = opt;
    this.getter = (type=='http') ? http : https;

    // check interval
    this.timer = timer;

    // store data from request, size according to number of check in a hour
    this.history = new container(Math.round(60/timer)+1);

    // internal clock of the website object
    this.tick = 0;
    this.availability = 100;

    // allow the website class to act without external trigger
    this.on("tick", () => {
      if(this.tick%(60*this.timer) == 0) {
        this.getContent()
          .then(() => {
            this.checkTimeFrame();
            this.tick = 0;
            this.setTick();
        }).catch(err => {console.log(err)});
      } else {
        this.checkTimeFrame();
        this.setTick();
      }
    });
  }

  /*
  * control time flow within the object
  */
  setTick() {
    this.tick = this.tick + 10;
    setTimeout(()=>{this.emit('tick')},5*1000);
  }

  /*
  * add the result from a request into the container
  * could be extended to add more metrics
  */
  addRes(res, start, delay,error=null) {
    this.history.insert({
      "status": (res!=null) ? res.statusCode : "failure",
      "delay":delay,
      "available": (res != null),
      "date": start,
      "error":error
    });
  }

  /*
  * trigger action based on time frame
  * could be reworked to be more flexible
  */
  checkTimeFrame() {
    if(this.tick%120==0) {
      this.checkAvailability(this.history.getAll());
    }
    if(this.tick%60==0) {
      this.displayInfo(this.history.getAll());
    } else {
      this.displayInfo(this.history.getHistory(Math.round(10/this.timer)+1));
    }

  }

  /*
  * send an http get request to the targeted website
  * store result even if the request fails
  */
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
          prompt.alert.log("ERROR : host ( "+ this.option.host +" ) cannot be reached");
          resolve(); //error are expected due to network or website failure
        }).end();
      });
   }

  /*
  * display the information into the console
  */
  displayInfo(data) {
    var l = Object.keys(data).length;
    if(l > 0) {
      var st = "last "+ l +" metrics for host : " + this.option.host;

      var res = this.responseTime(data);
      var status = this.responseStatus(data);
      var vbt = this.availability;

      st = st + "\n response time : max = " + res.max + ", min = " + res.min + ", avg = " + res.avg;
      st = st + "\n status code count = " + JSON.stringify(status);
      st = st + "\n website availability = " + vbt
      st = st + "\n";
      prompt.logger.log(st);
    }
  }

  /*
  * Compute max,min and avg response time
  * input it an sub-array issued from the container
  */
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
  /*
  * Store response status and their occurence
  * input it an sub-array issued from the container
  */
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

  /*
  * Comppute availability
  * input is a sub-array issued from the container
  * trigger an alarm into the alert part of the console
  */
  checkAvailability(data) {
    if(data.length > 0) {
      var downTime = 0;
      var upTime = 0;
      var date = data[0].date;
      data.map(element => {
          ("failure" == element.status) ? (++downTime): (++upTime);
      });
      var availability = Math.round((upTime/(upTime + downTime)) * 100);
      if(this.availability < 80 && availability < 80 ) {
        prompt.alert.log("\x1b[31m" + this.option.host + " availability below 80% for too long, at "+ date +"\x1b[37m");
      }
      if(this.availability < 80 && availability >= 80) {
        prompt.alert.log("\x1b[32m" + this.option.host + " availability is now above 80, at "+ date +"\x1b[37m");
      }
      this.availability = availability;
    }

  }
}
module.exports = Website;
