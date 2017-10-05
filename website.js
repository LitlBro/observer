var http = require('http');
var container = require("./container.js");

class Website {
  constructor (opt, color, timer=2) {
        this.option = opt;
        this.color=color;
        this.clock=timer;
        this.history = new container(10);
    }

     addRes(res, temp) {
      this.history.insert([res,temp]);
    }

    fireRequest() {
      let opt = this.option;
      let color = this.color;
      let start = new Date();

      let req = http.request(opt, res => {
          var time = new Date() - start;
          this.addRes(res,time);
          var st = "request to target : " + opt.host + " at date " + res.headers.date + "\n returned : " + res.statusCode + " and took = " + time + " ms";
          console.log(st);
        }
      );
      req.end();
    }

}

module.exports = Website;
