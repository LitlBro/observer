var buffer = require('./container.js');

var t = new buffer(4);

function f() {
  t.insert(10);
  t.insert(20);
  t.insert(30);
}

f();
console.log(t.getAll());

f();
console.log(t.getAll());

f();
console.log(t.getAll());
