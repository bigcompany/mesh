var resource = require('resource'),
    mesh = resource.define('mesh');


var Mesh = mesh.Mesh = require('./lib/Mesh');

mesh.method('listen', listen);
mesh.method('connect', connect);
mesh.method('start', start);

function listen (opts, cb) {
  var _mesh = new Mesh();
  mesh.emitter = _mesh.emitter;
  return _mesh.listen(opts, cb);
};

function connect (opts, cb) {
  var _mesh = new Mesh();
  mesh.emitter = _mesh.emitter;
  return _mesh.connect(opts, cb);
};

function start (opts, cb) {
  var _mesh = new Mesh();
  mesh.emitter = _mesh.emitter;
  return _mesh.start(opts, cb);
};




module['exports'] = mesh;