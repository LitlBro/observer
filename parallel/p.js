const { spawn } = require('child_process');
const prompt = require('../logger.js');
var fs = require("fs");

const observer = spawn('node', ['parallel.js', '{"option": {"host":"google.com"},"type":"https","timer": 2}']);

const pathToFile = process.argv[2];
var fs = require("fs");
var content = fs.readFileSync(pathToFile);
var jsonContent = JSON.parse(content);
for(var key in jsonContent) {
  var parameters = JSON.stringify(jsonContent[key]);
  const observer = spawn('node', ['parallel.js', parameters]);

  observer.stdout.on('data', (data) => {
    prompt.logger.log(`${data}`);
  });

  observer.stderr.on('data', (data) => {
    prompt.alert.log(`${data}`);
  });

  observer.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}
