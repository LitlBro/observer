const blessed = require('blessed')

//Create a blessed screen templates
screen = blessed.screen({
  smartCSR: true,
  autoPadding: true,
  warnings: true
});

// logger for regular data input and information
// located in the upper level of the application console screen
const logger = new blessed.log({
  top: '0',
  width: '100%',
  height: '50%',
  border: 'line',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollOnInput: false,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'yellow'
    },
    style: {
      inverse: true
    }
  }
});

// logger for irregular data input and alert
// located in the lower level of the application console screen
const alertLogger = new blessed.log({
  bottom: '0',
  width: '100%',
  height: '50%',
  border: 'line',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 100,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'yellow'
    },
    style: {
      inverse: true
    }
  }
});

screen.append(logger);
screen.append(alertLogger);

screen.key('q', function() {
  screen.destroy();
  console.log("q key pressed, \n" + "quitting application...");
  process.exit(1);
});

screen.render();

module.exports = {
  'logger': logger,
  'alert': alertLogger
}
