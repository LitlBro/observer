const blessed = require('blessed')

screen = blessed.screen({
  smartCSR: true,
  autoPadding: true,
  warnings: true
});

const logger = new blessed.log({
  top:'0',
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
const alertLogger = new blessed.log({
  bottom:'0',
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
/*
setInterval(function() {
    logger.log('test');
    alertLogger.log({foo:{bar:{baz:true}}});

  screen.render();
}, 100).unref();
*/
screen.key('q', function() {
  screen.destroy();
  console.log("quitting application");
  process.exit(1);
});

screen.render();

module.exports = {
  'logger':logger,
  'alert':alertLogger
}
