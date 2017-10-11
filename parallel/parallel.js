const http = require('http');
const https = require('https');
const EventEmitter = require('events');
const container = require("../container.js");

    const json = process.argv[2];
    console.log(json);
    const jsonContent = JSON.parse(json);

    const type = jsonContent.type;
    const option = jsonContent.option;
    const getter = (type == 'http') ? http : https;
    const threshold = 80;
    const ticker = new EventEmitter();

    var timer = jsonContent.timer;
    var history = new container(Math.round(60 / timer) + 1);
    var tick = 0;
    var availability = 100;

    ticker.on("tick", () => {
      if (tick % (60 * timer) == 0) {
        getContent()
          .then(() => {
            checkTimeFrame();
            setTick();
          }).catch(err => {
            console.log(err)
          });
      } else {
        checkTimeFrame();
        setTick();
      }
    });


    ticker.emit('tick');

  /*
   * control time flow within the object
   */
  function setTick() {
    tick = tick + 10;
    setTimeout(() => {
      ticker.emit('tick')
    }, 10 * 1000);
  }

  /*
   * add the result from a request into the container
   * could be extended to add more metrics
   */
  function addRes(res, start, delay, error = null) {
    history.insert({
      "status": (res != null) ? res.statusCode : "failure",
      "delay": delay,
      "available": (res != null),
      "date": start,
      "error": error
    });
  }

  /*
   * trigger action based on time frame
   * could be reworked to be more flexible
   */
  function checkTimeFrame() {
    if (tick % 120 == 0) {
      checkAvailability(history.getAll());
    }
    if (tick % 60 == 0) {
      displayInfo(history.getAll());
    } else {
      displayInfo(history.getHistory(Math.round(10 / timer) + 1));
    }

  }

  /*
   * send an http get request to the targeted website
   * store result even if the request fails
   */
  function getContent() {
    var opt = option;
    var start = new Date();
    return new Promise((resolve, reject) => {

      getter.request(opt, res => {
        var delay = new Date() - start;
        addRes(res, start, delay);
        resolve();
      }).on('error', err => {
        var delay = new Date() - start;
        addRes(null, start, delay, err);
        process.stderr.write("ERROR : host ( " + option.host + " ) cannot be reached");
        resolve(); //error are expected due to network or website failure
      }).end();
    });
  }

  /*
   * display the information into the console
   */
  function displayInfo(data) {
    var l = Object.keys(data).length;
    if (l > 0) {
      var st = "last " + l + " metrics for host : " + option.host;

      var res = responseTime(data);
      var status = responseStatus(data);
      var vbt = availability;

      st = st + "\n response time : max = " + res.max + ", min = " + res.min + ", avg = " + res.avg;
      st = st + "\n status code count = " + JSON.stringify(status);
      st = st + "\n website availability = " + vbt
      st = st + "\n";
      process.stdout.write(st);
    }
  }

  /*
   * Compute max,min and avg response time
   * input it an sub-array issued from the container
   */
  function responseTime(data) {

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

    var avg = (nbRequest == 0) ? "none" : Math.round(avgTime / nbRequest);
    return {
      "min": minTime,
      "avg": avg,
      "max": maxTime
    };
  }
  /*
   * Store response status and their occurence
   * input it an sub-array issued from the container
   */
  function responseStatus(data) {
    var allStatus = {};
    data.map(element => {
      if (allStatus[element.status]) {
        allStatus[element.status]++;
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
  function checkAvailability(data) {
    if (data.length > 0) {
      var downTime = 0;
      var upTime = 0;
      var date = data[0].date;
      data.map(element => {
        ("failure" == element.status) ? (++downTime) : (++upTime);
      });
      var newAvb = Math.round((upTime / (upTime + downTime)) * 100);
      if ((availability < threshold) && (newAvb < threshold)) {
        process.stderr.write("\x1b[31m" + option.host + " availability below 80% for too long, at " + date + "\x1b[37m");
      }
      if ((availability < threshold) && (newAvb >= threshold)) {
        process.stderr.write("\x1b[32m" + option.host + " availability is now above 80, at " + date + "\x1b[37m");
      }
      availability = newAvb;
    }

  }
