# observer
node.js application to monitor basic metrics of website

In order to monitor websites, define the needed properties (URL mandatory, other optional) as defined in example.json

summary :
* a website object is defined for each json entry
* a container is bound to a website object to store metrics
* the container size is defined by the check interval
* the first check on the website is triggered immediately

example.json :

"0":{
  "option": {
    "host":"motherboard.vice.com",
    "path":"/en_us/error"
  },
  "color":"\\x1b[33m",
  "timer": 3
}

website targeted :
  * motherboard.vice.com
  * path (optional) : /en_us/error

container size :
  * 60/3 + 1 (a check every 3 minutes, beginning at 0, so 21 check in a hour)
  * default check interval is 2 minutes => default container size : 31

alert color :
  * while passing threshold : \\x1b[33m
  * default is red
