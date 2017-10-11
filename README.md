# observer :
node.js application to monitor basic metrics of website

In order to monitor websites, define the needed properties (URL mandatory, other optional) as defined in example.json

a "type" index can be added for http or https

to execute use

`$ node main.js test/example.json`

to quit, press key "q"

summary :
* a website object is defined for each json entry
* a container is bound to a website object to store metrics
* the container size is defined by the check interval
* the website internal clock is triggered by a "tick"

example.json :

"0":{
  "option": {
    "host":"motherboard.vice.com",
    "path":"/en_us/error"
  },
  "timer": 3
}

website targeted :
  * motherboard.vice.com
  * path (optional) : /en_us/error

container size :
  * 60/3 + 1 (a check every 3 minutes, beginning at 0, so 21 check in a hour)
  * default check interval is 2 minutes => default container size : 31

# Improvements :

  In jsonParser.js :

  * could allow parallel processing using node swpan()

  In website.js :

  * if metrics are to grow in number, the display function and the compute function should be build into a separate object

  * the check request could be specified (HEAD ?) to prevent getting too many information
  (however the http HEAD method is not always implemented server-side)

  * request error could be parsed to detect either network errors or improper URL to build different error treatment

  * Time frame could be more flexible as a 10sec display could be irrelevant if data are updated every 2 minutes



# about parallelizing :

  when using the workload.json scenario, response time tend to grow because of node.js being single-threaded. the new Date() occurs way after the request has been completed. An other method could be used, however, the elaspedTime property has been deprecated

the branch parallel feature a basic solution. run the file named p.js with $ node p.js ../test/workload.json and see the difference in request time when using the same json file with main.js
